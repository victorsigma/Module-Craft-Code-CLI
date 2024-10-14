export const PICKAXE = {
    "format_version": "1.20.80",
    "minecraft:item": {
        "description": {
            "identifier": "namespace:crimson_pickaxe",
            "menu_category": {
                "category": "equipment",
                "group": "itemGroup.name.pickaxe"
            }
        },
        "components": {
            "minecraft:max_stack_size": 1,
            "minecraft:icon": {
                "textures": {
                    "default": "crimson_pickaxe"
                }
            },
            "minecraft:damage": {
                "value": 5
            },
            "minecraft:hand_equipped": true,
            "minecraft:enchantable": {
                "value": 5,
                "slot": "pickaxe"
            },
            "minecraft:durability": {
                "damage_chance": {
                    "min": 10,
                    "max": 50
                },
                "max_durability": 1048
            },
            "minecraft:repairable": {},
            "minecraft:tags": {
                "tags": [
                    "minecraft:is_pickaxe"
                ]
            },
            "minecraft:digger": {
                "use_efficiency": true,
                "destroy_speeds": [
                    {
                        "block": {
                            "tags": "q.any_tag('stone', 'metal', 'wood_pick_diggable', 'namespace:custom')"
                        },
                        "speed": 1.2
                    }
                ]
            }
        }
    }
}


export const AXE = {
    "format_version": "1.20.80",
    "minecraft:item": {
        "description": {
            "identifier": "namespace:crimson_axe",
            "menu_category": {
                "category": "equipment",
                "group": "itemGroup.name.axe"
            }
        },
        "components": {
            "minecraft:max_stack_size": 1,
            "minecraft:icon": {
                "textures": {
                    "default": "crimson_axe"
                }
            },
            "minecraft:damage": {
                "value": 7
            },
            "minecraft:hand_equipped": true,
            "minecraft:enchantable": {
                "value": 15,
                "slot": "axe"
            },
            "minecraft:durability": {
                "damage_chance": {
                    "min": 10,
                    "max": 50
                },
                "max_durability": 1048
            },
            "minecraft:repairable": {},
            "minecraft:tags": {
                "tags": [
                    "minecraft:is_axe"
                ]
            },
            "minecraft:digger": {
                "use_efficiency": true,
                "destroy_speeds": [
                    {
                        "block": {
                            "tags": "q.any_tag('wood', 'pumpkin', 'plant', 'namespace:custom')"
                        },
                        "speed": 1.0
                    }
                ]
            }
        }
    }
}

export const SWORD = {
    "format_version": "1.20.80",
    "minecraft:item": {
        "description": {
            "identifier": "namespace:crimson_sword",
            "menu_category": {
                "category": "equipment",
                "group": "itemGroup.name.sword"
            }
        },
        "components": {
            "minecraft:max_stack_size": 1,
            "minecraft:icon": {
                "textures": {
                    "default": "crimson_sword"
                }
            },
            "minecraft:hand_equipped": true,
            "minecraft:enchantable": {
                "value": 15,
                "slot": "sword"
            },
            "minecraft:durability": {
                "damage_chance": {
                    "min": 10,
                    "max": 50
                },
                "max_durability": 1048
            },
            "minecraft:repairable": {},
            "minecraft:tags": {
                "tags": [
                    "minecraft:is_sword"
                ]
            }
        }
    }
}


export const SHOVEL = {
    "format_version": "1.20.80",
    "minecraft:item": {
        "description": {
            "identifier": "namespace:crimson_shovel",
            "menu_category": {
                "category": "equipment",
                "group": "itemGroup.name.shovel"
            }
        },
        "components": {
            "minecraft:max_stack_size": 1,
            "minecraft:icon": {
                "textures": {
                    "default": "crimson_shovel"
                }
            },
            "minecraft:damage": {
                "value": 4
            },
            "minecraft:hand_equipped": true,
            "minecraft:enchantable": {
                "value": 15,
                "slot": "shovel"
            },
            "minecraft:durability": {
                "damage_chance": {
                    "min": 10,
                    "max": 50
                },
                "max_durability": 1048
            },
            "minecraft:repairable": {},
            "minecraft:tags": {
                "tags": [
                    "minecraft:is_shovel"
                ]
            },
            "minecraft:digger": {
                "use_efficiency": true,
                "destroy_speeds": [
                    {
                        "block": {
                            "tags": "q.any_tag('dirt', 'sand', 'gravel', 'grass', 'snow', 'namespace:custom')"
                        },
                        "speed": 1.5
                    }
                ]
            }
        }
    }
}
