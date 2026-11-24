import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '49180c4512fe4ba0ac8ac434d92e0370'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'dabd29237bc149b2bfc61cadb229980a'
                    }
                    viab_demo_1: {
                        table: 'x_2326104_cob_viab'
                        id: '6bb687c6d1554d1d9d7d50bf6bd43e10'
                    }
                    viab_demo_2: {
                        table: 'x_2326104_cob_viab'
                        id: 'af701c335c6849bdbe70365845ff5c89'
                    }
                    viab_report: {
                        table: 'sys_report'
                        id: 'edc21f20ae214909ac50de562cf8ea9d'
                    }
                    viab_step_insert: {
                        table: 'sys_atf_step'
                        id: '1df6e236a0904735ae5c790e0133b9e2'
                    }
                    viab_step_open: {
                        table: 'sys_atf_step'
                        id: '463e83219ee841adaac5e37822d7af53'
                    }
                    viab_step_set: {
                        table: 'sys_atf_step'
                        id: '6b7cb86de01d48b1b195d8f729f0231e'
                    }
                    viab_step_submit: {
                        table: 'sys_atf_step'
                        id: '0db988cae52a418e9b974ff5f2471ac6'
                    }
                    viab_step_validate: {
                        table: 'sys_atf_step'
                        id: '2d51527e8b9c4d049c52fb2214a85ac7'
                    }
                    viab_step_validate_form: {
                        table: 'sys_atf_step'
                        id: '0b41762bfe2c45ec8b78112f93890c2f'
                    }
                    viab_test_form: {
                        table: 'sys_atf_test'
                        id: '4ac38283949f486f9eb3b66377994eed'
                    }
                    viab_test_servidor: {
                        table: 'sys_atf_test'
                        id: 'b6aecf08071e4401be78513089354a82'
                    }
                }
                composite: [
                    {
                        table: 'sys_variable_value'
                        id: '03f4f9a59d1947f7b9bbeca9b3f62bab'
                        key: {
                            document_key: '0db988cae52a418e9b974ff5f2471ac6'
                            variable: 'ae8b91c9ffa333008d3f5d9ad53bf1ba'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '112e4929715f4b6da0dc1a7526df2a4a'
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'nome'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '16e8740eddcb4e38a74c765322f65e2f'
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2146f35436ec49e0bd39bb72a5a6a9bd'
                        key: {
                            document_key: '6b7cb86de01d48b1b195d8f729f0231e'
                            variable: '946f3c1a0f23330072e6452bc4767eda'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '25cef2a9e5824918bf76ec38e987056f'
                        key: {
                            document_key: '1df6e236a0904735ae5c790e0133b9e2'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '25dde28f1f004c5e96660c24095dc208'
                        key: {
                            document_key: '1df6e236a0904735ae5c790e0133b9e2'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '27b4b8c0f96745828a895d1e220da1c2'
                        key: {
                            document_key: '463e83219ee841adaac5e37822d7af53'
                            variable: '3a662f60a3023110571967d1361e6134'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '2ec62e548c904113883ec7ab45dabe5d'
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '39397958b10a44099f84d4089be0b687'
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '399567d3c29d4c60af00c3fa4f116743'
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3c5aade10ac34a9b861cfe1b3ebc301d'
                        key: {
                            document_key: '1df6e236a0904735ae5c790e0133b9e2'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '46a1321129b44bf893aa488bd89d20a3'
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '48bccee9196b4334a51d5d6ec9a917c6'
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4c906c28ff3b4371b252f9a0f36a26d4'
                        key: {
                            document_key: '463e83219ee841adaac5e37822d7af53'
                            variable: '27d4e1c25320220002c6435723dc3486'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '50e2138cbcf742dc95f357664502ca8a'
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '58fa63b0069d43d2a40ae494229c9298'
                        key: {
                            document_key: '1df6e236a0904735ae5c790e0133b9e2'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5d1114b305a64fbd8f65e9d7a8e9ebe1'
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5e8ded31c473490abad68a5f4a11c5d7'
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6d705e8c1cd84db19a4c880ecf0c6c26'
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6f5d05f66acd4d29a1ee4b2a2184016f'
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                            value: 'fechado'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '723eaf110ae94b379412c2e136d5c2de'
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '7395f2479acb47a1b59fd2e5e8e209f3'
                        key: {
                            name: 'x_2326104_cob_viab'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '74553fa1bc1640dbb6e1b11ea5c29101'
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'nome'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '7f8007aaef804a9485ac62fcf0efe043'
                        key: {
                            id: '2d51527e8b9c4d049c52fb2214a85ac7'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '8153bdc75ae043f2ae3148afe1bc0e7f'
                        key: {
                            id: '0b41762bfe2c45ec8b78112f93890c2f'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '831b6dc111ca4a3ba1c92d28efb3c2f5'
                        key: {
                            document_key: '0db988cae52a418e9b974ff5f2471ac6'
                            variable: 'c796d40497302200abe4bb7503ac4ad8'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '85b44187b7c5484cbfb9c9a09b770053'
                        key: {
                            name: 'x_2326104_cob_viab'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9072d1dcd8b2402b9c0326ce35cc550e'
                        key: {
                            name: 'x_2326104_cob_viab'
                            element: 'situacao'
                            value: 'aberto'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '99d542b9ce614dcb86f316bc02e78922'
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a206e65e3c294f428f9d96862f7a7165'
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b06409f0ce33489882d0cb78a5aec27c'
                        key: {
                            document_key: '463e83219ee841adaac5e37822d7af53'
                            variable: '6f2a59a4e7133300b5646ea8c2f6a975'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c8b9d6a6c5a04c5e94b481763c12b792'
                        key: {
                            document_key: '2d51527e8b9c4d049c52fb2214a85ac7'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'df17069da3ea4d56bf295f291241da0f'
                        key: {
                            document_key: '6b7cb86de01d48b1b195d8f729f0231e'
                            variable: 'b3dba2465320220002c6435723dc34f0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e6736b4fd5744e4fa15feb1a1f7b217f'
                        key: {
                            document_key: '6b7cb86de01d48b1b195d8f729f0231e'
                            variable: '424ca6465320220002c6435723dc34b5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e7020f58d7bf439abc87e993fcd25d3f'
                        key: {
                            document_key: '0b41762bfe2c45ec8b78112f93890c2f'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e7ebd572bdb948e7b6450114d847c0a9'
                        key: {
                            document_key: '463e83219ee841adaac5e37822d7af53'
                            variable: 'bb84ed825320220002c6435723dc3400'
                        }
                    },
                ]
            }
        }
    }
}
