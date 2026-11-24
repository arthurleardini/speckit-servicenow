import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    _exemplo_passo_seed: {
                        table: 'sys_atf_step'
                        id: 'a4edf56d28fb48c899095ad032ddd9af'
                        deleted: true
                    }
                    _exemplo_suite: {
                        table: 'sys_atf_test_suite'
                        id: '32454500e3484622821daec7d1a5f5b2'
                        deleted: true
                    }
                    _exemplo_teste_seed: {
                        table: 'sys_atf_test'
                        id: '2ae34b6647bc484ab627ee26851b4d5a'
                        deleted: true
                    }
                    acl_exdebito_read: {
                        table: 'sys_security_acl'
                        id: '4d303db110694227b27f5841f36b0164'
                        deleted: true
                    }
                    acl_exdebito_read_campos: {
                        table: 'sys_security_acl'
                        id: '4c706274a2ce442eb03a7a81840da648'
                        deleted: true
                    }
                    acl_exdevedor_read: {
                        table: 'sys_security_acl'
                        id: '8121050ae94141dc9b787bbc93636c71'
                        deleted: true
                    }
                    acl_exdevedor_read_campos: {
                        table: 'sys_security_acl'
                        id: '1731511b4208485d848b33046b594c09'
                        deleted: true
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '49180c4512fe4ba0ac8ac434d92e0370'
                    }
                    menu_app: {
                        table: 'sys_app_application'
                        id: '3c9fac6604e64d1785ec90f5014f6a2c'
                        deleted: true
                    }
                    modulo_1_exdebito: {
                        table: 'sys_app_module'
                        id: 'fda17db11ca84ba188622f97097df2f3'
                        deleted: true
                    }
                    modulo_1_exdevedor: {
                        table: 'sys_app_module'
                        id: 'adc5d6926d1c487297ef2d836ebe12cd'
                        deleted: true
                    }
                    modulo_grupo_1: {
                        table: 'sys_app_module'
                        id: '77c0ee7ee0fa4d9fb5468869b2568402'
                        deleted: true
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'dabd29237bc149b2bfc61cadb229980a'
                    }
                    seed_exdebito_001: {
                        table: 'x_2326104_cob_exdebito'
                        id: '9807f49e9a0d446abdca2bb0c9c84292'
                        deleted: true
                    }
                    seed_exdebito_002: {
                        table: 'x_2326104_cob_exdebito'
                        id: 'e604b712df5e4d64a848cfb085f834f2'
                        deleted: true
                    }
                    seed_exdebito_003: {
                        table: 'x_2326104_cob_exdebito'
                        id: 'bf7f352fded44882bf68899210611a18'
                        deleted: true
                    }
                    seed_exdebito_004: {
                        table: 'x_2326104_cob_exdebito'
                        id: 'bef10a9d95434f9f8c3458c5c6eaf997'
                        deleted: true
                    }
                    seed_exdebito_005: {
                        table: 'x_2326104_cob_exdebito'
                        id: 'ce5d27b5c17149f2982799429f3f6bc3'
                        deleted: true
                    }
                    seed_exdevedor_001: {
                        table: 'x_2326104_cob_exdevedor'
                        id: 'dcc8e818d46246f8b9c6abf2e6a60de4'
                        deleted: true
                    }
                    seed_exdevedor_002: {
                        table: 'x_2326104_cob_exdevedor'
                        id: '417c348e150b4435a36b7c0ce0b77b65'
                        deleted: true
                    }
                    seed_exdevedor_003: {
                        table: 'x_2326104_cob_exdevedor'
                        id: '7650933283fb46ec8e374e6aee150053'
                        deleted: true
                    }
                    seed_exdevedor_004: {
                        table: 'x_2326104_cob_exdevedor'
                        id: '8f9227178f924a59979e4a189fbdd8e8'
                        deleted: true
                    }
                    seed_exdevedor_005: {
                        table: 'x_2326104_cob_exdevedor'
                        id: 'ac87d9fc272a4b31a68d009982741df2'
                        deleted: true
                    }
                    'TEL-EX1_journal_1': {
                        table: 'sys_journal_field'
                        id: '6fd5837a38f947728cc5eb89adf88107'
                        deleted: true
                    }
                    'TEL-EX1_journal_2': {
                        table: 'sys_journal_field'
                        id: 'fdbf1222ceab4c57888d49c3e6c329eb'
                        deleted: true
                    }
                    'TEL-EX1_registro_demo': {
                        table: 'x_2326104_cob_exdevedor'
                        id: 'e80cd4005145493588a9e292a2de21fa'
                        deleted: true
                    }
                    usuario_demo_atendente: {
                        table: 'sys_user'
                        id: '2025d7f2bd7441c48df1615ed9361d6e'
                        deleted: true
                    }
                    usuario_demo_atendente_role: {
                        table: 'sys_user_has_role'
                        id: '336861d0d80c4062b9981d23b3d4379e'
                        deleted: true
                    }
                    usuario_demo_coordenador: {
                        table: 'sys_user'
                        id: 'cdc46f79b3c8463c9d4c3aad67de52f9'
                        deleted: true
                    }
                    usuario_demo_coordenador_role: {
                        table: 'sys_user_has_role'
                        id: '0710c3221b964837b55ffbecf3702052'
                        deleted: true
                    }
                    viab_demo_1: {
                        table: 'x_2326104_cob_viab'
                        id: '6bb687c6d1554d1d9d7d50bf6bd43e10'
                        deleted: true
                    }
                    viab_demo_2: {
                        table: 'x_2326104_cob_viab'
                        id: 'af701c335c6849bdbe70365845ff5c89'
                        deleted: true
                    }
                    viab_report: {
                        table: 'sys_report'
                        id: 'edc21f20ae214909ac50de562cf8ea9d'
                        deleted: true
                    }
                    viab_step_insert: {
                        table: 'sys_atf_step'
                        id: '1df6e236a0904735ae5c790e0133b9e2'
                        deleted: true
                    }
                    viab_step_open: {
                        table: 'sys_atf_step'
                        id: '463e83219ee841adaac5e37822d7af53'
                        deleted: true
                    }
                    viab_step_set: {
                        table: 'sys_atf_step'
                        id: '6b7cb86de01d48b1b195d8f729f0231e'
                        deleted: true
                    }
                    viab_step_submit: {
                        table: 'sys_atf_step'
                        id: '0db988cae52a418e9b974ff5f2471ac6'
                        deleted: true
                    }
                    viab_step_validate: {
                        table: 'sys_atf_step'
                        id: '2d51527e8b9c4d049c52fb2214a85ac7'
                        deleted: true
                    }
                    viab_step_validate_form: {
                        table: 'sys_atf_step'
                        id: '0b41762bfe2c45ec8b78112f93890c2f'
                        deleted: true
                    }
                    viab_test_form: {
                        table: 'sys_atf_test'
                        id: '4ac38283949f486f9eb3b66377994eed'
                        deleted: true
                    }
                    viab_test_servidor: {
                        table: 'sys_atf_test'
                        id: 'b6aecf08071e4401be78513089354a82'
                        deleted: true
                    }
                }
                composite: [
                    {
                        table: 'sys_db_object'
                        id: '028c78a6ea894fc48a58d9cc7f59deca'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '03f4f9a59d1947f7b9bbeca9b3f62bab'
                        deleted: true
                        key: {
                            document_key: '0db988cae52a418e9b974ff5f2471ac6'
                            variable: 'ae8b91c9ffa333008d3f5d9ad53bf1ba'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '063e77d421994017a39a17a30a77fcfe'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6b9860e6872048909419169a41cd3919'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    caption: 'Débito (exemplo)'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '08e22f03b0d34f14aaf9b01fc7a4acb7'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '57c9bc159fc943bcaacd1756b3f7789e'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Ficha do devedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0a327e6c7d21401fb2bec002cb66ed19'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '112e4929715f4b6da0dc1a7526df2a4a'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'nome'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '14bba5cf6cb6495e8274a863a0044aec'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6b9860e6872048909419169a41cd3919'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    caption: 'Débito (exemplo)'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'valor'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '16e8740eddcb4e38a74c765322f65e2f'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1a7c95754fff4b1b98ef1101d5a24fd6'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '57c9bc159fc943bcaacd1756b3f7789e'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Ficha do devedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '21144ad75be94a19ba55c3db9929402f'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6b9860e6872048909419169a41cd3919'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    caption: 'Débito (exemplo)'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2146f35436ec49e0bd39bb72a5a6a9bd'
                        deleted: true
                        key: {
                            document_key: '6b7cb86de01d48b1b195d8f729f0231e'
                            variable: '946f3c1a0f23330072e6452bc4767eda'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '229a1e81bf204488a8197d0923603170'
                        deleted: true
                        key: {
                            sys_security_acl: '1731511b4208485d848b33046b594c09'
                            sys_user_role: {
                                id: '8f9564b315df4b25b5716b753d5c2616'
                                key: {
                                    name: 'x_2326104_cob.atendente'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '22d4ca67fd754e5993935445751825f0'
                        deleted: true
                        key: {
                            sys_security_acl: '4c706274a2ce442eb03a7a81840da648'
                            sys_user_role: {
                                id: '8f9564b315df4b25b5716b753d5c2616'
                                key: {
                                    name: 'x_2326104_cob.atendente'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '25cef2a9e5824918bf76ec38e987056f'
                        deleted: true
                        key: {
                            document_key: '1df6e236a0904735ae5c790e0133b9e2'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '25dde28f1f004c5e96660c24095dc208'
                        deleted: true
                        key: {
                            document_key: '1df6e236a0904735ae5c790e0133b9e2'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '276706a7826d42e18d1dd07ce0862f51'
                        deleted: true
                        key: {
                            sys_ui_form: {
                                id: '3bec11f1a06c40abb98165e61371cd96'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '6b9860e6872048909419169a41cd3919'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    caption: 'Débito (exemplo)'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '27b4b8c0f96745828a895d1e220da1c2'
                        deleted: true
                        key: {
                            document_key: '463e83219ee841adaac5e37822d7af53'
                            variable: '3a662f60a3023110571967d1361e6134'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '2ec62e548c904113883ec7ab45dabe5d'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '31ce9544f99242d4ba181bd0b48f3cff'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            caption: 'Atividades'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '33fb16ca0dce4defa19d037dcd819a3b'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'comentarios'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: '34b4d6d916b64a2fa5e53db992a90a8f'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '35127f46cea24b25b74981e76260f556'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '57c9bc159fc943bcaacd1756b3f7789e'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Ficha do devedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'situacao'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '371039241e5f46dc93b09fe323433789'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'situacao'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '391f14318b5d4862ba6efcadb7d1cea8'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'valor'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '39397958b10a44099f84d4089be0b687'
                        deleted: true
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3992eb53523a4f748ecf62ad330f28e5'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'vencimento'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '399567d3c29d4c60af00c3fa4f116743'
                        deleted: true
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3a2e8d83e0aa45c288f64103d70d00ea'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'situacao'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '3bec11f1a06c40abb98165e61371cd96'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3c5aade10ac34a9b861cfe1b3ebc301d'
                        deleted: true
                        key: {
                            document_key: '1df6e236a0904735ae5c790e0133b9e2'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3f73b9246d6340ce848b66f279f4b8bc'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'valor'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '46a1321129b44bf893aa488bd89d20a3'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '48bccee9196b4334a51d5d6ec9a917c6'
                        deleted: true
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4ac232a2ae7d492687d2fea24a50a967'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '57c9bc159fc943bcaacd1756b3f7789e'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Ficha do devedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '4b23e15183a14ffa9fe753487f299a57'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4c906c28ff3b4371b252f9a0f36a26d4'
                        deleted: true
                        key: {
                            document_key: '463e83219ee841adaac5e37822d7af53'
                            variable: '27d4e1c25320220002c6435723dc3486'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4e76fb8cf5204011b1e64a87bd5991a2'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6b9860e6872048909419169a41cd3919'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    caption: 'Débito (exemplo)'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '50e2138cbcf742dc95f357664502ca8a'
                        deleted: true
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '5213bb9705f247c2b088aa2266129f2a'
                        deleted: true
                        key: {
                            list_id: {
                                id: '34b4d6d916b64a2fa5e53db992a90a8f'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'descricao'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '55e19fad216b4c869d204b8f16530ebf'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'cpf'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '57c9bc159fc943bcaacd1756b3f7789e'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            caption: 'Ficha do devedor'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '58fa63b0069d43d2a40ae494229c9298'
                        deleted: true
                        key: {
                            document_key: '1df6e236a0904735ae5c790e0133b9e2'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '599aa9231de14442aac0dfd02fdaf3ad'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '57c9bc159fc943bcaacd1756b3f7789e'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Ficha do devedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'cpf'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '5c42da80883040f096c2c98517aa56ff'
                        deleted: true
                        key: {
                            list_id: {
                                id: '34b4d6d916b64a2fa5e53db992a90a8f'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'devedor'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5d1114b305a64fbd8f65e9d7a8e9ebe1'
                        deleted: true
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5e8ded31c473490abad68a5f4a11c5d7'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '5eac408f2953494ea2565f80c93de8dd'
                        deleted: true
                        key: {
                            id: 'a4edf56d28fb48c899095ad032ddd9af'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            field: 'script'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '6b9860e6872048909419169a41cd3919'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            caption: 'Débito (exemplo)'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6d705e8c1cd84db19a4c880ecf0c6c26'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6f5d05f66acd4d29a1ee4b2a2184016f'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                            value: 'fechado'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '6f94a38221634662a291ff2ab07fdea8'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '70884dca93e942808eb0bf9484ec497e'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6b9860e6872048909419169a41cd3919'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    caption: 'Débito (exemplo)'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'vencimento'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '723eaf110ae94b379412c2e136d5c2de'
                        deleted: true
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '7395f2479acb47a1b59fd2e5e8e209f3'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '74553fa1bc1640dbb6e1b11ea5c29101'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'nome'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '7545d42db1264287a7b18b60bc06549f'
                        deleted: true
                        key: {
                            sys_ui_form: {
                                id: '4b23e15183a14ffa9fe753487f299a57'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '57c9bc159fc943bcaacd1756b3f7789e'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Ficha do devedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7b1270a7da55420fa3547a3529b153c8'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'vencimento'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7dd9465f13fe4277bad1ec2a22554a61'
                        deleted: true
                        key: {
                            sys_security_acl: '4c706274a2ce442eb03a7a81840da648'
                            sys_user_role: {
                                id: 'f5f61890af5a43769616de8586ec6188'
                                key: {
                                    name: 'x_2326104_cob.coordenador'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7f34b0c5178847108b077c3f64c2c883'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'descricao'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '7f8007aaef804a9485ac62fcf0efe043'
                        deleted: true
                        key: {
                            id: '2d51527e8b9c4d049c52fb2214a85ac7'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '8153bdc75ae043f2ae3148afe1bc0e7f'
                        deleted: true
                        key: {
                            id: '0b41762bfe2c45ec8b78112f93890c2f'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '831b6dc111ca4a3ba1c92d28efb3c2f5'
                        deleted: true
                        key: {
                            document_key: '0db988cae52a418e9b974ff5f2471ac6'
                            variable: 'c796d40497302200abe4bb7503ac4ad8'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '85b44187b7c5484cbfb9c9a09b770053'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '85f21eb311f8452b903b908f178b4c60'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'ficticio'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8aeb17ef06bd458a8ba6ed7abd74c737'
                        deleted: true
                        key: {
                            sys_security_acl: '8121050ae94141dc9b787bbc93636c71'
                            sys_user_role: {
                                id: '8f9564b315df4b25b5716b753d5c2616'
                                key: {
                                    name: 'x_2326104_cob.atendente'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '8f9564b315df4b25b5716b753d5c2616'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob.atendente'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9072d1dcd8b2402b9c0326ce35cc550e'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                            value: 'aberto'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9264dd63c4c2482b9c2008971632a229'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'nome'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '9750eb7fa18b43c2873480ed8f6d692a'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '988a9bc5b5884a53a6435aa10707abfb'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '99d542b9ce614dcb86f316bc02e78922'
                        deleted: true
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9c1689e505004748b1568df57aec0d2f'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'nome'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9cd3301d72ab46aa918c3fbb59a9a8dc'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'situacao'
                            value: 'suspenso'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a206e65e3c294f428f9d96862f7a7165'
                        deleted: true
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'af5b9ec7d3de4fa6ade376285619e4d9'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'devedor'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b06409f0ce33489882d0cb78a5aec27c'
                        deleted: true
                        key: {
                            document_key: '463e83219ee841adaac5e37822d7af53'
                            variable: '6f2a59a4e7133300b5646ea8c2f6a975'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b17cf7ec02e84242b10f6f92f12b58a5'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b9da8cb322a044409f1991d7133cd1d4'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '57c9bc159fc943bcaacd1756b3f7789e'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Ficha do devedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'nome'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bf152892ce654ab485d409fd982e8165'
                        deleted: true
                        key: {
                            document_key: 'a4edf56d28fb48c899095ad032ddd9af'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'c1e4185cbcc648dea5128637dffd0fb2'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'situacao'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c3b780529e524be3ae034a53da941d11'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'ficticio'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c6f9cb52e828490da02894a04bc64b3e'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '31ce9544f99242d4ba181bd0b48f3cff'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Atividades'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'activity.xml'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c785957a2dc94dcca92368d58e50b811'
                        deleted: true
                        key: {
                            sys_security_acl: '4d303db110694227b27f5841f36b0164'
                            sys_user_role: {
                                id: 'f5f61890af5a43769616de8586ec6188'
                                key: {
                                    name: 'x_2326104_cob.coordenador'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c8b9d6a6c5a04c5e94b481763c12b792'
                        deleted: true
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cc0dce8b22294ac98b38ab73c8030316'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'descricao'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd185eed4fc554535ad6fce457a2573db'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'd65628ce886d4428b545169fbc16f062'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'd668566dfb344d2f9830b732176dce1f'
                        deleted: true
                        key: {
                            sys_ui_form: {
                                id: '4b23e15183a14ffa9fe753487f299a57'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '31ce9544f99242d4ba181bd0b48f3cff'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Atividades'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dd4cc5078047420780a51eabc682fd28'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'comentarios'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'dd71a4994a304e1c979f270b80d247bc'
                        deleted: true
                        key: {
                            sys_security_acl: '1731511b4208485d848b33046b594c09'
                            sys_user_role: {
                                id: 'f5f61890af5a43769616de8586ec6188'
                                key: {
                                    name: 'x_2326104_cob.coordenador'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'df17069da3ea4d56bf295f291241da0f'
                        deleted: true
                        key: {
                            document_key: '6b7cb86de01d48b1b195d8f729f0231e'
                            variable: 'b3dba2465320220002c6435723dc34f0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e03705962f424152a59f1245084c8ae5'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6b9860e6872048909419169a41cd3919'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    caption: 'Débito (exemplo)'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'devedor'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e09cb95b421940749acb84bd4aebe756'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6b9860e6872048909419169a41cd3919'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    caption: 'Débito (exemplo)'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'descricao'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e312e7c866e040868700bd0d1aa9f4d5'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'cpf'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e36b22be799242d0a76477c5e17acb06'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdevedor'
                            element: 'situacao'
                            value: 'ativo'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e6304aafc2ad4a82a9ff634915c676d1'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob_exdebito'
                            element: 'devedor'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e6736b4fd5744e4fa15feb1a1f7b217f'
                        deleted: true
                        key: {
                            document_key: '6b7cb86de01d48b1b195d8f729f0231e'
                            variable: '424ca6465320220002c6435723dc34b5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e7020f58d7bf439abc87e993fcd25d3f'
                        deleted: true
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e7ebd572bdb948e7b6450114d847c0a9'
                        deleted: true
                        key: {
                            document_key: '463e83219ee841adaac5e37822d7af53'
                            variable: 'bb84ed825320220002c6435723dc3400'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e9d3d7b07d4340cd84348cfafa35a8ab'
                        deleted: true
                        key: {
                            list_id: {
                                id: '34b4d6d916b64a2fa5e53db992a90a8f'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'vencimento'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ec90126868e8434c830a4baf65162262'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '57c9bc159fc943bcaacd1756b3f7789e'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Ficha do devedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'comentarios'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'ed79958acb234092ad5484e9e0e8585c'
                        deleted: true
                        key: {
                            test_suite: '32454500e3484622821daec7d1a5f5b2'
                            test: '2ae34b6647bc484ab627ee26851b4d5a'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f3cc952bc8894a899921e9224da031fb'
                        deleted: true
                        key: {
                            sys_security_acl: '4d303db110694227b27f5841f36b0164'
                            sys_user_role: {
                                id: '8f9564b315df4b25b5716b753d5c2616'
                                key: {
                                    name: 'x_2326104_cob.atendente'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f432826d6d3b4bb08b7f5d40a57fcbd7'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '57c9bc159fc943bcaacd1756b3f7789e'
                                key: {
                                    name: 'x_2326104_cob_exdevedor'
                                    caption: 'Ficha do devedor'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'ficticio'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f5a7724404614c33b15b607aac14b9e1'
                        deleted: true
                        key: {
                            sys_security_acl: '8121050ae94141dc9b787bbc93636c71'
                            sys_user_role: {
                                id: 'f5f61890af5a43769616de8586ec6188'
                                key: {
                                    name: 'x_2326104_cob.coordenador'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'f5f61890af5a43769616de8586ec6188'
                        deleted: true
                        key: {
                            name: 'x_2326104_cob.coordenador'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fc75760ac05643bfb07e9a99a724f6a2'
                        deleted: true
                        key: {
                            document_key: 'a4edf56d28fb48c899095ad032ddd9af'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'fcfd1422b8d84a4093cd7fdf95566450'
                        deleted: true
                        key: {
                            list_id: {
                                id: '34b4d6d916b64a2fa5e53db992a90a8f'
                                key: {
                                    name: 'x_2326104_cob_exdebito'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'valor'
                        }
                    },
                ]
            }
        }
    }
}
