import { humanBodyData } from './human-body-data'
import { HumanBodyData } from './types'

export const humanBodyPositions: HumanBodyData = {
    systems: {
        "Sistema Nervoso": {
            organs: {
                "Cérebro": {
                    position: { x: 50, y: 5, radius: 25 },
                    conditions: humanBodyData["Sistema Nervoso"]["Cérebro"]
                },
                "Coluna": {
                    position: { x: 50, y: 40, radius: 40 },
                    conditions: humanBodyData["Sistema Nervoso"]["Coluna"]
                }
            }
        },
        "Sistema Respiratório": {
            organs: {
                "Pulmões": {
                    position: { x: 50, y: 25, radius: 30 },
                    conditions: humanBodyData["Sistema Respiratório"]["Pulmões"]
                },
                "Seios paranasais": {
                    position: { x: 50, y: 8, radius: 15 },
                    conditions: humanBodyData["Sistema Respiratório"]["Seios paranasais"]
                }
            }
        },
    }
} 