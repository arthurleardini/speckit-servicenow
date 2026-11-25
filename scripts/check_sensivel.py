#!/usr/bin/env python3
"""
check_sensivel.py — varredura de dados sensíveis / sigilo fiscal em arquivos .md
(ou qualquer texto). Rodar SEMPRE após tombar um arquivo para .md.

Uso:
    python3 scripts/check_sensivel.py ARQUIVO.md [OUTRO.md ...]
    python3 scripts/check_sensivel.py --stdin < arquivo
    python3 scripts/check_sensivel.py --hook        # lê JSON do hook PostToolUse no stdin

Saída: relatório por arquivo + score 0-100. Exit code:
    0  = limpo / baixo (score < 40)
    2  = ALERTA: dado sensível real provável (score >= 40)  -> sinaliza para o agente

Heurística, não parecer jurídico. Mascara nada — só detecta e pontua.
"""
import sys, re, json, os

# ---- padrões de PII ----
CPF  = re.compile(r'\b\d{3}[.\- ]\d{3}[.\- ]\d{3}[.\-]\d{2}\b')
CNPJ = re.compile(r'\b\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}\b')
RG   = re.compile(r'\b\d{1,2}\.\d{3}\.\d{3}-[\dxX]\b')
EMAIL_PESSOAL = re.compile(r'\b[a-z]+\.[a-z]+@(?!sefaz|fazenda|gov|adece|bcb)[a-z0-9.-]+\.[a-z]{2,}\b', re.I)
CEP  = re.compile(r'\bCEP[:\s]*\d{5}-?\d{3}\b', re.I)

# ---- gatilhos de sigilo fiscal (CTN art. 198) ----
FISCAL = re.compile(
    r'\b(sigilo fiscal|d[ée]bito|d[íi]vida ativa|inscri[çc][ãa]o estadual|'
    r'dossi[êe]|contribuinte|rating de risco|cobran[çc]a qualificada|'
    r'auto de infra[çc][ãa]o|cr[ée]dito tribut[áa]rio|parcelamento|'
    r'situa[çc][ãa]o fiscal|NF-e|ICMS|IPVA|ITCD)\b', re.I)

# ---- sinais de dado FICTÍCIO/mock (reduzem score). NÃO usar \*{2,}: colide com **bold** md ----
MOCK = re.compile(r'fict[íi]ci(?:o|a)|\bmock\b|dados de exemplo|lorem ipsum|placeholder|'
                  r'\d{3}\.\*{3}\.\*{3}|\*{3}\.\*{3}', re.I)

def uniq(rx, text):
    return set(m.group(0) for m in rx.finditer(text))

def scan(text):
    cpf   = uniq(CPF, text)
    cnpj  = uniq(CNPJ, text)
    rg    = uniq(RG, text)
    email = uniq(EMAIL_PESSOAL, text)
    cep   = len(CEP.findall(text))
    fiscal = len(FISCAL.findall(text))
    is_mock = bool(MOCK.search(text))

    # ---- score (foco em dado PESSOAL LGPD + sigilo fiscal; CNPJ=PJ pesa pouco) ----
    score = 0
    score += min(len(cpf) * 7, 55)         # CPF: pessoa natural, pesa muito
    score += min(len(rg) * 8, 20)
    score += min(len(email) * 2, 12)       # email pessoal
    score += min(len(cnpj) * 1, 10)        # CNPJ não é dado pessoal LGPD -> peso baixo
    score += min(cep, 3)
    if fiscal >= 3:
        score += 20                        # contexto de sigilo fiscal
    elif fiscal >= 1:
        score += 8
    # redução só p/ conteúdo claramente sintético e sem identificador pessoal forte
    if is_mock and len(cpf) <= 3 and not rg:
        score = int(score * 0.2)
    score = min(score, 100)

    faixa = ("CRÍTICO" if score >= 90 else "ALTO" if score >= 70 else
             "MÉDIO" if score >= 40 else "BAIXO" if score >= 10 else "MÍNIMO")
    return dict(score=score, faixa=faixa, cpf=len(cpf), cnpj=len(cnpj),
                rg=len(rg), email=len(email), cep=cep, fiscal=fiscal, mock=is_mock)

def report(name, r):
    flag = "⚠️ " if r["score"] >= 40 else "✅ "
    print(f"{flag}{name}")
    print(f"   score {r['score']}/100 [{r['faixa']}]  "
          f"CPF={r['cpf']} CNPJ={r['cnpj']} RG={r['rg']} "
          f"email_pessoal={r['email']} CEP={r['cep']} sigilo_fiscal_hits={r['fiscal']}"
          f"{'  (mock detectado)' if r['mock'] else ''}")
    if r["score"] >= 40:
        print("   AÇÃO: anonimizar antes de versionar/subir a cloud/enviar a LLM externo. "
              "Sigilo fiscal = CTN art. 198.")

def main():
    args = sys.argv[1:]
    worst = 0

    if args and args[0] == "--hook":
        try:
            data = json.load(sys.stdin)
        except Exception:
            return 0
        ti = data.get("tool_input", {}) or {}
        path = ti.get("file_path", "")
        if not path.endswith(".md") or not os.path.isfile(path):
            return 0
        text = open(path, encoding="utf-8", errors="ignore").read()
        r = scan(text)
        if r["score"] >= 40:
            report(path, r)
            print(">>> arquivo .md tombado contém dado sensível provável. Revisar/anonimizar.",
                  file=sys.stderr)
            return 2
        return 0

    if args and args[0] == "--stdin":
        r = scan(sys.stdin.read())
        report("<stdin>", r)
        return 2 if r["score"] >= 40 else 0

    if not args:
        print(__doc__)
        return 0

    for path in args:
        if not os.path.isfile(path):
            print(f"-- pulado (não existe): {path}")
            continue
        r = scan(open(path, encoding="utf-8", errors="ignore").read())
        report(path, r)
        worst = max(worst, r["score"])
    return 2 if worst >= 40 else 0

if __name__ == "__main__":
    sys.exit(main())
