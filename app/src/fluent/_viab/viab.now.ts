// Teste de viabilidade do estágio 0 (item 9 do design). Descartável: removido após registrar o desfecho.
import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, Record, Test } from '@servicenow/sdk/core'

export const x_2326104_cob_viab = Table({
    name: 'x_2326104_cob_viab',
    label: 'Viabilidade',
    schema: {
        nome: StringColumn({ label: 'Nome', maxLength: 80 }),
        situacao: ChoiceColumn({
            label: 'Situação',
            choices: {
                aberto: { label: 'Aberto', sequence: 0 },
                fechado: { label: 'Fechado', sequence: 1 },
            },
        }),
    },
})

Record({
    $id: Now.ID['viab_demo_1'],
    $meta: { installMethod: 'demo' },
    table: 'x_2326104_cob_viab',
    data: { nome: 'Registro demo 1', situacao: 'aberto' },
})

Record({
    $id: Now.ID['viab_demo_2'],
    $meta: { installMethod: 'demo' },
    table: 'x_2326104_cob_viab',
    data: { nome: 'Registro demo 2', situacao: 'fechado' },
})

Record({
    $id: Now.ID['viab_report'],
    table: 'sys_report',
    data: {
        title: 'Viabilidade por situação',
        table: 'x_2326104_cob_viab',
        type: 'bar',
        field: 'situacao',
        aggregate: 'COUNT',
        is_published: true,
    },
})

Test(
    {
        $id: Now.ID['viab_test_servidor'],
        name: 'Viabilidade: insert e validação no servidor',
        description: 'Insere um registro na tabela de viabilidade com situacao=aberto e valida que o registro gravado tem nome e situacao esperados (checagem 1 do item 9, lado servidor).',
        failOnServerError: true,
    },
    (atf) => {
        const ins = atf.server.recordInsert({
            $id: Now.ID['viab_step_insert'],
            table: 'x_2326104_cob_viab',
            fieldValues: { nome: 'ATF servidor', situacao: 'aberto' },
        })
        atf.server.recordValidation({
            $id: Now.ID['viab_step_validate'],
            table: 'x_2326104_cob_viab',
            recordId: ins.record_id,
            fieldValues: 'nome=ATF servidor^situacao=aberto',
            assert: 'record_validated',
        })
    }
)

Test(
    {
        $id: Now.ID['viab_test_form'],
        name: 'Viabilidade: form na UI16',
        description: 'Abre o form novo da tabela de viabilidade na UI clássica, preenche nome, envia e valida o registro gravado (checagem 1 do item 9, lado form).',
        failOnServerError: true,
    },
    (atf) => {
        atf.form.openNewForm({ $id: Now.ID['viab_step_open'], table: 'x_2326104_cob_viab', formUI: 'standard_ui' })
        atf.form.setFieldValue({
            $id: Now.ID['viab_step_set'],
            table: 'x_2326104_cob_viab',
            fieldValues: { nome: 'ATF form' },
            formUI: 'standard_ui',
        })
        const sub = atf.form.submitForm({ $id: Now.ID['viab_step_submit'], assert: 'form_submitted_to_server', formUI: 'standard_ui' })
        atf.server.recordValidation({
            $id: Now.ID['viab_step_validate_form'],
            table: 'x_2326104_cob_viab',
            recordId: sub.record_id,
            fieldValues: 'nome=ATF form',
            assert: 'record_validated',
        })
    }
)
