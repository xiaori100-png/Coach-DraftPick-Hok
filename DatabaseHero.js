/* DatabaseHero.js — Method A (data-only, sumber kebenaran hero)
 *
 * Exposes:
 *   window.DatabaseHero.HEROES: Hero[]
 *
 * Catatan:
 * - Semua analisa/diskusi harus merujuk data di file ini (bukan dari luar repo).
 * - Field minimum yang dipakai aplikasi draft saat ini: id, name, role, tags, image.
 * - Referensi vocabulary untuk field coachProfile ada di: CoachSchema.md
 */

(function () {
  'use strict';

  window.DatabaseHero = window.DatabaseHero || {};

  window.DatabaseHero.HEROES = [
    {
      id: 'wukong',
      name: 'Wukong',
      role: 'Jungling',
      secondaryRoles: [],

      tags: ['assassin', 'burst', 'late_game', 'nimble', 'mobility', 'melee', 'physical', 'crit', 'shield', 'dash', 'spell_shield', 'true_damage', 'execute', 'cc', 'launch', 'mark'],



      image: 'images/heroes/wukong.png',

      profile: {
        traits: ['Late Game', 'Nimble'],
        type: 'Assassin',
        subtype: 'Burst Assassin',
        uniqueness: ['Mendekati', 'CC'],
        power: 'Late Game',
        lane: 'Jungling'
      },

      skills: {
        passive: {
          name: 'The Great Sage',
          categories: ['enhance', 'physical', 'basic_attack_amp', 'crit_scaling'],
          rawDescription: 'Skill Pasif: The Great Sage (Tingkatkan, Damage Fisik)\nSetelah menggunakan Skill, Wukong meningkatkan Serangan Dasar berikutnya, membuatnya menerjang target untuk menimbulkan 648 (475+100% Serangan Fisik) Damage Fisik. Skill ini mendapatkan efek sepenuhnya dari bonus serangan Critical.\n(Wukong memiliki Critical Rate dasar 20%, tapi Critical Damage dasar miliknya hanya 150%).',
          mechanics: {
            trigger: {
              event: 'after_skill_cast',
              includesUltimate: true
            },
            enhancedBasicAttack: {
              windowSec: 7,
              delivery: 'targeted_dash',
              validTargets: ['hero', 'minion', 'monster', 'tower'],
              countsAsBasicAttack: true,
              usesFullCriticalBonuses: true,
              damage: {
                physical: { baseDamage: 475, bonusPhysicalAttackPct: 100 }
              }
            }
          }
        },

        skill1: {
          name: 'Protective Shroud',
          cdSec: 12,
          manaCost: 65,
          categories: ['spell_shield', 'invincible', 'shield', 'speed_up'],
          rawDescription: 'Skill 1: Protective Shroud (Kekebalan, Shield, Gerak Cepat) (CD 12 Detik) Konsumsi Mana 65\nWukong membacakan mantra pelindungan yang membuatnya mampu menahan Skill musuh berikutnya yang mendarat padanya. Mantra ini aktif selama 1,5 Detik. Jika berhasil menahan suatu Skill, dia menjadi Invincible selama 0,2 Detik dan mendapatkan Shield yang menangkal 859 (600+150% Serangan Fisik + 15% HP ekstra) Damage selama 4 Detik.\n(Dia mendapatkan 40% Kecepatan Gerakan selama 1 Detik saat menggunakan Skill ini)',
          mechanics: {
            delivery: 'self_buff',
            moveSpeedBuff: {
              moveSpeedBonusPct: 40,
              durationSec: 1
            },
            spellShield: {
              durationSec: 1.5,
              triggersOnce: true,
              blocksEnemySkills: true,
              blocksBasicAttacks: false,
              blocksTowerShots: false,
              notes: ['Menahan 1 skill musuh pertama yang mendarat (targeted atau skillshot yang mengenai).']
            },
            onSpellShieldTrigger: {
              invincibleDurationSec: 0.2,
              shield: {
                durationSec: 4,
                value: { base: 600, bonusPhysicalAttackPct: 150, bonusHpPct: 15 }
              }
            }
          }
        },

        skill2: {
          name: 'Furious Advance',
          cdSec: 6,
          manaCost: 45,
          categories: ['movement', 'dash', 'speed_up', 'true_damage', 'execute'],
          rawDescription: 'Skill 2: Furious Advance (Gerakan, Gerak Cepat) (CD 6 Detik) Konsumsi Mana 45\nWukong Dash ke arah target. Jika menghantam musuh saat Dash, dia akan melompatinya dan mendapatkan 90% Kecepatan Gerakan yang akan berkurang dalam rentang 1 Detik. Menggunakan Serangan Dasar atau Skill akan membatalkan lompatan ini.\n(Monster Slayer: Dash ke Monster akan menimbulkan 274 (240+20% Serangan Fisik) True Damage. Jika HP Monster kurang dari 15%, Monster akan terkena Damage Grievous. Efek ini tidak berlaku untuk Overlord atau Tyrant)',
          mechanics: {
            delivery: 'point_dash',
            dash: {
              direction: 'to_point',
              notes: ['Bisa melewati tembok tipis jika jarak/angle memungkinkan.']
            },
            onHitEnemy: {
              vaultOverTarget: true,
              vaultDistance: 'fixed',
              moveSpeedDecayBuff: {
                moveSpeedBonusPct: 90,
                durationSec: 1,
                decay: 'linear'
              },
              cancelOn: ['basic_attack', 'skill_cast'],
              notes: ['Wukong tetap bisa basic/cast kapan saja; melakukan basic/cast akan membatalkan state vault/MS buff.']
            },
            monsterSlayer: {
              appliesTo: ['monster'],
              excluded: ['Overlord', 'Tyrant'],
              trueDamage: { baseDamage: 240, bonusPhysicalAttackPct: 20 },
              executeThresholdTargetHpPct: 15,
              notes: ['Jika HP monster < 15%, memicu execute (Damage Grievous).']
            }
          }
        },

        skill3: {
          name: 'Golden Cudgel',
          cdSec: 35,
          manaCost: 100,
          categories: ['cc', 'mark', 'physical', 'aoe', 'launch', 'basic_attack_amp'],
          rawDescription: 'Skill 3: Golden Cudgel (CC, Mark, Damage Fisik) (CD 35 Detik) Konsumsi Mana 100\nWukong menghantamkan tongkatnya ke Bumi, menimbulkan 250 (250+80% Serangan Fisik ekstra) Damage Fisik pada musuh dalam jangkauan dan membuat mereka terkena efek Launch selama 1 Detik.\nDia juga menempatkan 3 mark pada musuh dalam jangkauan. Ketika Serangan Dasarnya menghantam musuh dengan mark, target akan kehilangan satu mark dan menerima 270 Damage Fisik ekstra.',
          mechanics: {
            delivery: 'aoe_self',
            damage: {
              physical: { baseDamage: 250, bonusPhysicalAttackPct: 80 }
            },
            crowdControl: {
              effect: 'launch',
              durationSec: 1
            },
            mark: {
              stacks: 3,
              durationSec: 7,
              appliesTo: ['hero'],
              consumedBy: 'basic_attack',
              onConsume: {
                damage: { physical: { baseDamage: 270 } },
                canCrit: false
              }
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 183, base: 173, bonus: 10 },
          maxHP: 3334,
          maxMana: 560,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 20,
          criticalDamagePct: 150,
          moveSpeed: 385,
          hpRegenPer5s: 50,
          manaRegenPer5s: 14,
          attackRange: 'Melee'
        },

        level15: {
          physicalAttack: { total: 351, base: 341, bonus: 10 },
          maxHP: 6626,
          maxMana: 1120,
          physicalDefense: { value: 367 },
          magicDefense: { value: 159 },
          attackSpeedBonusPct: 26,
          criticalRatePct: 20,
          criticalDamagePct: 150,
          moveSpeed: 385,
          hpRegenPer5s: 87,
          manaRegenPer5s: 28,
          attackRange: 'Melee'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Assassin',
          playPattern: 'Flanker/pick assassin: farming jungle lalu cari angle masuk dari sisi/belakang untuk one-shot satu target terisolasi. Pola: S2 dash masuk → S3 AoE launch + mark → pasif enhanced basic + S1 spell shield untuk block CC saat burst window. Bukan pembuka war untuk tim — masuk sendirian ke target spesifik, bukan ke kerumunan.',
          engageRole: 'secondary',
          notes: [
            'Wukong masuk duluan secara fisik tapi bukan primary engager — dia flanker yang mencari target terisolasi, bukan tank yang membuka war untuk tim ikut masuk.',
            'S1 spell shield adalah defensive tool saat burst window (block 1 skill musuh), bukan escape murni.',
            'S3 AoE launch memberi window untuk tim follow-up, tapi Wukong sendiri tidak bisa sustain di tengah kerumunan tanpa setup.'
          ]
        },

        powerCurve: {
          early: 'low',
          mid: 'medium',
          late: 'high',
          notes: ['Power spike utama di late game sesuai profile; butuh ekonomi/item untuk maksimal.']
        },

        draftValues: {
          mobility: 'high',
          frontline: 'low',
          sustain: 'low',

          engage: 'medium',
          disengage: 'medium',
          peel: 'low',

          cc: 'medium',
          pickPotential: 'high',

          burst: 'high',
          dps: 'medium'
        },

        crowdControl: [
          {
            source: 'skill3',
            effect: 'launch',
            delivery: 'aoe_self',
            reliability: 'high',
            durationSec: 1,
            notes: ['Launch 1 detik dari AoE slam (berpusat pada Wukong).']
          }
        ],

        mobilityProfile: {
          level: 'high',
          uses: ['engage', 'chase', 'reposition'],
          notes: ['Pasif memberi targeted dash pada enhanced basic setelah cast skill. S1 memberi MS 40% (1 detik) dan spell-shield window 1,5 detik. S2 adalah point dash; jika menghantam musuh, vault melewati target lalu mendapat MS +90% (decay 1 detik; batal jika basic/cast).']
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Shouyue', compatibilityPct: 3.04 },
            { externalName: 'Gan & Mo', compatibilityPct: 2.52 },
            { externalName: 'Kui', compatibilityPct: 2.35 },
            { externalName: 'Donghuang', compatibilityPct: 1.93 }
          ],
          trio: [
            { externalNames: ['Mozi', 'Shouyue'], compatibilityPct: 14.12 },
            { externalNames: ['Gan & Mo', 'Shouyue'], compatibilityPct: 8.19 },
            { externalNames: ['Diaochan', 'Shouyue'], compatibilityPct: 7.08 },
            { externalNames: ['Daji', 'Donghuang'], compatibilityPct: 5.2 },
            { externalNames: ['Kui', 'Li Xin'], compatibilityPct: 4.33 },
            { externalNames: ['Angela', 'Kui'], compatibilityPct: 3.88 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh vision/control area agar Wukong bisa memilih target pick yang aman.',
            'Butuh follow-up damage/CC dari tim untuk mengamankan pick atau reset setelah commit.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Peel kuat + hard CC yang menghentikan burst window assassin.',
            'Invade/deny jungle di early game untuk menahan scaling late game.'
          ]
        },

        needsValidation: {
          questions: []
        }
      }
    },
    {
      id: 'chicha',
      name: 'Chicha',
      role: 'Clash Lane',
      secondaryRoles: ['Jungling'],

      // Tags untuk mesin rekomendasi draft saat ini (dan untuk search).
      // Minimal yang relevan untuk scoring engine sekarang: tank/frontline, cc/control, magic, physical
      tags: ['fighter', 'diver', 'mobility', 'cleanup', 'physical', 'sustain', 'dps', 'attack_speed', 'stance', 'cooldown_cut', 'range_scaling', 'cc', 'engage', 'displacement', 'knockup', 'knockback', 'root', 'true_damage', 'execute', 'cc_immunity', 'damage_reduction', 'multi_target', 'enhance', 'basic_attack_amp', 'move_while_attacking', 'overkill_lock'],

      // Boleh belum ada file gambarnya; UI tetap bagus karena ada gradient overlay.
      image: 'images/heroes/chicha.png',

      // Data mentah dari user (untuk analisa build nanti).
      profile: {
        traits: ['Nimble', 'Versatile'],
        type: 'Fighter',
        subtype: 'Charger',
        uniqueness: ['Serangan Cepat', 'Cleanup'],
        power: 'Seimbang (Early, Mid, Late Game)',
        lane: 'Clash Lane',
        sub: 'Jungler'
      },

      skills: {
        passive: {
          name: 'Pasif',
          categories: ['sustain', 'dps', 'attack_speed', 'stance', 'cooldown_cut', 'range_scaling'],
          rawDescription: 'Chicha bertempur sambil beralih di antara kelima senjatanya sesuai urutan (Polearm, Spear, Dagger-Axe, Halberd, dan Bow). Setiap Serangan Dasarnya memulihkan 20 (20/40+0,3% HP ekstra) HP dan membuatnya beralih ke senjata berikutnya yang juga meningkatkan jangkauan serangannya. Setiap hantaman Serangan Dasar atau Skill memberi 1 tumpuk Fighting Spirit (selama 4 Detik, maks 8 tumpukan). Setiap tumpukan meningkatkan Kecepatan Serangan sebesar 4%/8% (Bisa melampaui batas Kecepatan Serangan). Polearm dan Spear memberikan Defense Form, Dagger-Axe dan Halbert memberikannya Offense Form, sedangkan Bow memberikannya Overkill Form. (Setiap Form memiliki efek Skill 1 dan Skill 2 yang berbeda. Memasuki Overkill Form akan langsung mempersingkat CD Skill 1 dan Skill 2 sebesar 50%).',
          mechanics: {
            weaponCycle: ['Polearm', 'Spear', 'Dagger-Axe', 'Halberd', 'Bow'],
            basicAttackHeal: {
              baseHealByLevel: { level1: 20, level15: 40 },
              bonusHpPct: 0.3
            },
            fightingSpirit: {
              durationSec: 4,
              maxStacks: 8,
              attackSpeedPerStackPctByLevel: { level1: 4, level15: 8 },
              canExceedCap: true,
              gainedBy: ['basic', 'skill-hit']
            },
            forms: {
              'Defense Form': ['Polearm', 'Spear'],
              'Offense Form': ['Dagger-Axe', 'Halberd'],
              'Overkill Form': ['Bow']
            },
            overkillEffect: {
              skill1Skill2CooldownReductionPct: 50
            }
          }
        },

        skill1: {
          name: 'Skill 1',
          cdSec: 10,
          manaCost: 50,
          categories: ['cc', 'physical', 'movement'],
          rawDescription: 'Skill 1: Peak-Crushing Polearm (CC, Damage Fisik, Gerakan) (CD 10/9,6/9,2/8,8/8,4/8 Detik) Konsumsi Mana 50\nDefense Form: Chicha mengayunkan senjatanya dan melompat ke arah target, menimbulkan 200 (200/240/280/320/360/400+65% Serangan Fisik ekstra) Damage Fisik sekaligus memukul mundur musuh yang dilewatinya ke lokasi tujuan bersamanya. Setelah sampai di tujuan, ia menghantam tanah, menimbulkan 200 (200/240/280/320/360/400+65% Serangan Fisik ekstra) Damage Fisik dan Launch (selama 0,75 Detik) pada musuh.\n\nSkill 1: Hell-Binding Dagger-Axe (CC, Damage Fisik, Gerakan) (CD 10/9,6/9,2/8,8/8,4/8 Detik) Konsumsi Mana 50\nOffense Form: Chicha mengaitkan senjatanya ke arah target, menimbulkan 225 (225/270/315/360/405/450+75% Serangan Fisik ekstra) Damage Fisik sekaligus menarik musuh yang dilewatinya ke lokasi tujuan bersamanya. Setelah sampai di tujuan ia menghantam ke tanah, menimbulkan 225 (225/270/315/360/405/450+75% Serangan Fisik ekstra) Damage Fisik dan Launch (selama 0,75 Detik) pada musuh.\n\nSkill 1: Sky-Shattering Bow (CC, Damage Fisik, Gerakan) (CD 10/9,6/9,2/8,8/8,4/8 Detik) Konsumsi Mana 50\nOverkill Form: Chicha melancarkan tendangan terbang ke arah target dan menembakkan panah yang menembus, menimbulkan 250 (250/300/350/400/450/500+85% Serangan Fisik ekstra) Damage Fisik dan memukul mundur musuh (selama 0,75 Detik). Jika musuh terpental ke tembok, menimbulkan 250 (250/300/350/400/450/500+85% Serangan Fisik ekstra) Damage Fisik dan membatasi pergerakan mereka (selama 2 Detik.)',
          mechanics: {
            cooldownSecBySkillLevel: [10, 9.6, 9.2, 8.8, 8.4, 8]
          },
          variants: {
            defenseForm: {
              name: 'Peak-Crushing Polearm',
              categories: ['cc', 'physical', 'movement'],
              mechanics: {
                hits: {
                  firstHit: { baseDamageBySkillLevel: [200, 240, 280, 320, 360, 400], bonusPhysicalAttackPct: 65 },
                  secondHit: { baseDamageBySkillLevel: [200, 240, 280, 320, 360, 400], bonusPhysicalAttackPct: 65 }
                },
                displacement: {
                  type: 'push_along_path',
                  note: 'Memukul mundur musuh yang dilewati ke lokasi tujuan bersama Chicha.'
                },
                cc: {
                  launchDurationSec: 0.75
                }
              }
            },

            offenseForm: {
              name: 'Hell-Binding Dagger-Axe',
              categories: ['cc', 'physical', 'movement'],
              mechanics: {
                hits: {
                  firstHit: { baseDamageBySkillLevel: [225, 270, 315, 360, 405, 450], bonusPhysicalAttackPct: 75 },
                  secondHit: { baseDamageBySkillLevel: [225, 270, 315, 360, 405, 450], bonusPhysicalAttackPct: 75 }
                },
                displacement: {
                  type: 'pull_along_path',
                  note: 'Menarik musuh yang dilewati ke lokasi tujuan bersama Chicha.'
                },
                cc: {
                  launchDurationSec: 0.75
                }
              }
            },

            overkillForm: {
              name: 'Sky-Shattering Bow',
              categories: ['cc', 'physical', 'movement'],
              mechanics: {
                hits: {
                  hit: { baseDamageBySkillLevel: [250, 300, 350, 400, 450, 500], bonusPhysicalAttackPct: 85 },
                  wallProc: {
                    baseDamageBySkillLevel: [250, 300, 350, 400, 450, 500],
                    bonusPhysicalAttackPct: 85,
                    restrictMovementDurationSec: 2
                  }
                },
                displacement: {
                  type: 'knockback',
                  durationSec: 0.75,
                  note: 'Memukul mundur musuh.'
                },
                cc: {
                  knockbackDurationSec: 0.75,
                  wallProcRestrictMovementDurationSec: 2
                }
              }
            }
          }
        },

        skill2: {
          name: 'Skill 2',
          cdSec: 10,
          manaCost: 50,
          categories: ['physical', 'sustain', 'knockback'],
          rawDescription: 'Skill 2: World-Splitting Spear (Damage Fisik, Pemulihan, Pukul Mundur) (CD 10/9,6/9,2/8,8/8,4/8 Detik) Konsumsi Mana 50\nDefense Form: Chicha menusukkan senjatanya ke arah target, menimbulkan 450 (450/540/630/720/810/900+150% Serangan Fisik ekstra) Damage Fisik dan memukul mundur musuh (bukan CC). Dia memulihkan 180 (180/216/252/288/324/360+3% HP ekstra) HP untuk setiap target yang terhantam (hanya setengahnya jika menghantam Unit Non-Hero)\n\nSkill 2: Realm-Sweeping Halberd (Damage Fisik, Pemulihan, Pukul Mundur) (CD 10/9,6/9,2/8,8/8,4/8 Detik) Konsumsi Mana 50\nOffense Form: Chicha menebas ke arah target, menimbulkan 475 (475/570/665/760/855/950+160% Serangan Fisik ekstra) Damage Fisik dan memukul mundur musuh (bukan CC). Dia memulihkan 180 (180/216/252/288/324/360+3% HP ekstra) HP untuk setiap target yang terhantam (hanya setengahnya jika menghantam Unit Non-Hero).\n\nSkill 2: Star-Felling Arrow (True Damage, Pemulihan, Pukul Mundur) (CD 10/9,6/9,2/8,8/8,4/8 Detik) Konsumsi Mana 50\nOverkill Form: Chicha membidik ke arah traget dan mengincar semua musuh dalam Jangkauan (maks 5 target, dengan Hero musuh sebagai Prioritasnya). Setelah itu, dia menembakkan panah pada semua target yang diincar, menimbulkan 500 (500/600/700/800/900/1000+170% Serangan Fisik ekstra) Damage Fisik plus True Damage sebesar 10% dari HP yang hilang dari target, serta memukul mundur musuh (bukan CC). Untuk setiap target yang terhantam, dia memulihkan 180 (180/216/252/288/324/360+3% HP ekstra) HP (hanya setengahnya jika menghantam Unit Non-Hero)\n(Selama Skill ini aktif, Chicha mendapatkan Kekebalan CC dan 15/18/21/24/27/30% Reduksi Damage).',
          mechanics: {
            cooldownSecBySkillLevel: [10, 9.6, 9.2, 8.8, 8.4, 8]
          },
          variants: {
            defenseForm: {
              name: 'World-Splitting Spear',
              categories: ['physical', 'sustain', 'knockback'],
              mechanics: {
                hit: { baseDamageBySkillLevel: [450, 540, 630, 720, 810, 900], bonusPhysicalAttackPct: 150 },
                displacement: {
                  type: 'knockback',
                  isCrowdControl: false,
                  note: 'Memukul mundur musuh (bukan CC).'
                },
                healing: {
                  perTarget: { baseHealBySkillLevel: [180, 216, 252, 288, 324, 360], bonusHpPct: 3 },
                  nonHeroMultiplier: 0.5
                }
              }
            },

            offenseForm: {
              name: 'Realm-Sweeping Halberd',
              categories: ['physical', 'sustain', 'knockback'],
              mechanics: {
                hit: { baseDamageBySkillLevel: [475, 570, 665, 760, 855, 950], bonusPhysicalAttackPct: 160 },
                displacement: {
                  type: 'knockback',
                  isCrowdControl: false,
                  note: 'Memukul mundur musuh (bukan CC).'
                },
                healing: {
                  perTarget: { baseHealBySkillLevel: [180, 216, 252, 288, 324, 360], bonusHpPct: 3 },
                  nonHeroMultiplier: 0.5
                }
              }
            },

            overkillForm: {
              name: 'Star-Felling Arrow',
              categories: ['physical', 'true_damage', 'sustain', 'knockback', 'multi_target', 'cc_immunity', 'damage_reduction', 'execute'],
              mechanics: {
                targeting: {
                  maxTargets: 5,
                  priority: 'enemy_hero'
                },
                damage: {
                  physical: { baseDamageBySkillLevel: [500, 600, 700, 800, 900, 1000], bonusPhysicalAttackPct: 170 },
                  trueDamage: { type: 'missing_hp_pct', pct: 10 }
                },
                displacement: {
                  type: 'knockback',
                  isCrowdControl: false,
                  note: 'Memukul mundur musuh (bukan CC).'
                },
                healing: {
                  perTarget: { baseHealBySkillLevel: [180, 216, 252, 288, 324, 360], bonusHpPct: 3 },
                  nonHeroMultiplier: 0.5
                },
                selfBuff: {
                  ccImmunity: true,
                  damageReductionPctBySkillLevel: [15, 18, 21, 24, 27, 30]
                }
              }
            }
          }
        },

        skill3: {
          name: 'Skill 3',
          cdSec: 40,
          manaCost: 130,
          categories: ['enhance', 'physical', 'attack_speed', 'movement'],
          rawDescription: 'Skill 3: Return Of The Armsmaster (Tingkatkan, Damage Fisik) (CD 40/36/32 Detik) Konsumsi Mana 130\nChicha mengeluarkan kelima senjatanya, mendapatkan peningkatan 80/90/100% Kecepatan Gerakan (selama 2 Detik), 35/52,5/70% Kecepatan Serangan, serta melampaui batas tumpukan Fighting Spirit (selama 6 Detik).\nSelama mengeluarkan kelima senjatanya, setiap Serangan Dasar menimbulkan 36 (36/54/72+12% Serangan Fisik ekstra) Damage Fisik tambahan.\n(Selama Skill ini aktif, dia bisa menyerang dengan Serangan Dasar sambil terus bergerak, dan saat memasuki Overkill Form, dia akan tetap berada dalam Form tersebut).',
          mechanics: {
            cooldownSecBySkillLevel: [40, 36, 32],
            durationSec: 6,
            moveSpeedBonusPctBySkillLevel: [80, 90, 100],
            moveSpeedBuffDurationSec: 2,
            attackSpeedBonusPctBySkillLevel: [35, 52.5, 70],
            fightingSpirit: {
              canExceedStackCap: true
            },
            basicAttackBonusDamage: {
              baseDamageBySkillLevel: [36, 54, 72],
              bonusPhysicalAttackPct: 12
            },
            moveWhileAttacking: true,
            overkillFormLock: true
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 180, base: 170, bonus: 10 },
          maxHP: 3472,
          maxMana: 580,
          physicalDefense: { value: 150, damageReductionPct: 20 },
          magicDefense: { value: 75, damageReductionPct: 11.1 },
          attackSpeedBonusPct: 0,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 390,
          hpRegenPer5s: 53,
          manaRegenPer5s: 15,
          attackRange: 'Jarak Dekat'
        },

        level15: {
          physicalAttack: { total: 360, base: 350, bonus: 10 },
          maxHP: 7532,
          maxMana: 1160,
          physicalDefense: { value: 407, damageReductionPct: 40.4 },
          magicDefense: { value: 180, damageReductionPct: 23 },
          attackSpeedBonusPct: 14,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 390,
          hpRegenPer5s: 99,
          manaRegenPer5s: 30,
          attackRange: 'Jarak Dekat'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Fighter',
          playPattern: 'Follow-up diver/cleaner: bangun stack Fighting Spirit lewat basic attack + skill hit, lalu cycle form (Defense → Offense → Overkill) untuk tempo extended fight. Masuk fight setelah primary engage membuka — S1 sebagai follow-up displacement, S3 untuk cleanup/chase dengan move-while-attacking. True damage S2 Overkill Form (10% missing HP) tetap relevan bahkan saat tertinggal item.',
          engageRole: 'secondary',
          notes: [
            'Chicha butuh pembuka war (primary engage) dari tim; ia lebih konsisten sebagai follow-up daripada membuka sendiri.',
            'Win condition utama: timing masuk fight saat stack Fighting Spirit sudah terbangun + cycle form optimal untuk all-in.',
            'S2 Overkill Form punya CC immunity + damage reduction 15-30% — window all-in yang relatif aman meski tertinggal item.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'high',
          late: 'medium',
          notes: [
            'Butuh waktu untuk membangun stack Fighting Spirit dan mengatur cycle form agar maksimal.',
            'Overkill Form memotong CD Skill 1 & 2 (50%) saat masuk form, memberi window tempo untuk all-in / re-engage.'
          ]
        },

        draftValues: {
          mobility: 'high',
          frontline: 'medium',
          sustain: 'high',

          engage: 'medium',
          disengage: 'low',
          peel: 'low',

          cc: 'medium',
          pickPotential: 'medium',

          burst: 'medium',
          dps: 'high'
        },

        crowdControl: [
          {
            source: 'skill1.defenseForm',
            effect: 'launch',
            delivery: 'targeted_dash',
            reliability: 'medium',
            durationSec: 0.75,
            notes: ['Defense Form: ada displacement sepanjang jalur + launch 0,75 detik pada impact.']
          },
          {
            source: 'skill1.offenseForm',
            effect: 'launch',
            delivery: 'targeted_hook_pull',
            reliability: 'medium',
            durationSec: 0.75,
            notes: ['Offense Form: menarik musuh yang dilewati ke lokasi tujuan + launch 0,75 detik pada impact.']
          },
          {
            source: 'skill1.overkillForm',
            effect: 'knockback',
            delivery: 'targeted_dash',
            reliability: 'medium',
            durationSec: 0.75,
            notes: ['Overkill Form: knockback 0,75 detik.']
          },
          {
            source: 'skill1.overkillForm.wallProc',
            effect: 'root',
            delivery: 'conditional_wall_tether',
            reliability: 'medium',
            durationSec: 2,
            notes: [
              'Jika musuh terpental ke tembok: ada efek "restrict movement" 2 detik.',
              'Validasi player: secara visual terasa seperti tether/root (ada lingkaran + tali pengikat).',
              'Efek ini situasional; nilai utama Chicha tetap pada tempo stack/form.'
            ]
          },
          {
            source: 'skill2.defenseForm',
            effect: 'knockback',
            delivery: 'targeted_melee',
            reliability: 'high',
            countsAsCrowdControl: false,
            notes: ['Di data mentah: knockback pada Skill 2 disebut "bukan CC" (tetap displacement).']
          },
          {
            source: 'skill2.offenseForm',
            effect: 'knockback',
            delivery: 'targeted_melee',
            reliability: 'high',
            countsAsCrowdControl: false,
            notes: ['Di data mentah: knockback pada Skill 2 disebut "bukan CC" (tetap displacement).']
          },
          {
            source: 'skill2.overkillForm',
            effect: 'knockback',
            delivery: 'targeted_multi',
            reliability: 'high',
            countsAsCrowdControl: false,
            notes: ['Overkill Form: auto-target hingga 5 target, ada knockback (bukan CC).']
          }
        ],

        mobilityProfile: {
          level: 'high',
          uses: ['engage', 'chase', 'reposition'],
          notes: [
            'Akses mobility sangat dipengaruhi cycle form; opsi keluar (escape) tidak selalu tersedia saat dibutuhkan.',
            'Mobility lebih ke engage/chase, bukan escape — S1 butuh posisi terbuka, S3 lebih ke cleanup/chase.'
          ],
          sources: [
            {
              source: 'skill1',
              type: 'gapclose',
              delivery: 'targeted_dash',
              reliability: 'medium',
              notes: ['Skill 1 punya komponen movement, namun fleksibilitasnya dipengaruhi form-cycle (tidak selalu tersedia sebagai escape).']
            },
            {
              source: 'skill3',
              type: 'moveSpeedBuff',
              delivery: 'self_buff',
              reliability: 'high',
              durationSec: 2,
              notes: ['Skill 3 memberi MS buff 2 detik (data mentah).']
            },
            {
              source: 'skill3',
              type: 'moveWhileAttacking',
              delivery: 'self_buff',
              reliability: 'high',
              notes: ['Skill 3: bisa basic attack sambil bergerak (kualitas chase/kite).']
            }
          ]
        },

        needsValidation: {
          questions: []
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Zhang Fei', compatibilityPct: 2.35 },
            { externalName: 'Shi', compatibilityPct: 2.30 }
          ],
          trio: [
            { externalNames: ['Zhang Fei', 'Shi'], compatibilityPct: 6.18 },
            { externalNames: ['Zhang Fei', 'Nuwa'], compatibilityPct: 4.03 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh pembuka war/lockdown dari tim agar Chicha bisa follow-up dengan aman.',
            'Lebih konsisten jika ada frontline/engage lain (Chicha bukan tank murni).'
          ]
        },

        counterplay: {
          counteredBy: [
            'Peel kuat + chain hard CC (menghentikan dive dan mematikan momentum).',
            'Kiting/disengage (memutus extended fight dan menjaga jarak dari melee).',
            'Anti-heal/grievous wounds (mengurangi value sustain dari pasif + Skill 2).'
          ],
          notes: ['Sebagian nilai Chicha datang dari sustain + tempo; jika dua hal itu diputus, impact turun signifikan.']
        }
      },

      coachNotes: {
        summary: 'Fighter charger yang lincah dan fleksibel. Fokus masuk-keluar fight dan cleanup setelah tim buka war.',
        draftStrengths: ['Bagus untuk dive/backline jika tim punya engage', 'Cleanup target HP rendah', 'Power stabil early-mid-late'],
        draftRisks: ['Melee: rentan kena CC/peel berat', 'Butuh setup/engage tim agar tidak masuk sendirian']
      }
    },
    {
      id: 'daji',
      name: 'Daji',
      role: 'Mid Lane',
      secondaryRoles: [],

      tags: ['mage', 'artillery', 'burst', 'poke', 'late_game', 'magic', 'ranged', 'cc'],

      image: 'images/heroes/daji.png',

      profile: {
        type: 'Mage',
        subtype: 'Artillery Mage',
        uniqueness: ['Burst', 'Beraksi'],
        power: 'Late Game',
        lane: 'Mid Lane'
      },

      skills: {
        passive: {
          name: 'Captivate',
          categories: ['debuff', 'magic_shred', 'burst_amp'],
          rawDescription: 'Setiap kali Skill Daji menimbulkan Damage, dia menempatkan 1 tumpukan Captivate pada target, maksimum 3 tumpukan. Setiap tumpukan mengurangi Pertahanan Magis musuh tersebut selama 3 Detik sebesar 36-72, tergantung Level Daji.',
          mechanics: {
            maxStacks: 3,
            durationSec: 3,
            durationRefreshesOnApply: true,
            appliedBy: ['skill_damage'],
            magicDefenseReductionPerStack: {
              min: 36,
              max: 72,
              scalesWithLevel: true
            }
          }
        },

        skill1: {
          name: 'Soul Impact',
          cdSec: 5,
          manaCost: 40,
          categories: ['magic', 'damage', 'burst'],
          rawDescription: 'Skill 1: Soul Impact (Damage Magis) (CD 5 Detik) Konsumsi Mana 40\nDaji menembakkan Soul Blast ke arah target, menimbulkan 570 (570+120% Serangan Magis) Damage Magis pada musuh yang tertembak.',
          mechanics: {
            delivery: 'skillshot_line',
            damage: {
              magic: { baseDamage: 570, bonusMagicAttackPct: 120 }
            }
          }
        },

        skill2: {
          name: 'Strike a Pose',
          cdSec: 9,
          manaCost: 70,
          categories: ['magic', 'damage', 'cc'],
          rawDescription: 'Skill 2: Strike a Pose (CC, Damage Magis) (CD 9 Detik) Konsumsi Mana 70\nDaji melontarkan Love Spell pada satu musuh, menimbulkan 285 (285+66% Serangan Magis) Damage Magis dan membuat target Stun selama 1,5 Detik.',
          mechanics: {
            delivery: 'targeted',
            damage: {
              magic: { baseDamage: 285, bonusMagicAttackPct: 66 }
            },
            crowdControl: {
              effect: 'stun',
              durationSec: 1.5
            }
          }
        },

        skill3: {
          name: 'Heartbreaker',
          cdSec: 15,
          manaCost: 120,
          categories: ['magic', 'damage', 'burst', 'multi_hit', 'auto_target'],
          rawDescription: 'Skill 3: Heartbreaker (Damage Magis) (CD 15 Detik) Konsumsi Mana 120\nDaji melontarkan 5 hati yang mengejar musuh acak dalam jangkauan, setiap hati menimbulkan 325 (325+75% Serangan Magis) Damage Magis.\n(Saat beberapa hati menghantam target yang sama, hati setelah yang pertama hanya menimbulkan 50% dari Damage Magis yang pertama).',
          mechanics: {
            delivery: 'auto_target_homing',
            projectiles: {
              count: 5,
              targeting: 'random_in_range',
              priority: 'enemy_hero',
              notes: [
                'Prioritas target: hero musuh (tidak mengarah ke minion jika ada hero di jangkauan).',
                'Jika ada lebih dari 1 hero musuh di jangkauan, proyektil akan menyebar secara acak antar hero.'
              ]
            },
            damage: {
              magicPerProjectile: { baseDamage: 325, bonusMagicAttackPct: 75 },
              multiHitSameTarget: { subsequentHitMultiplier: 0.5 }
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 172, base: 172, bonus: 0 },
          magicAttack: { total: 10, base: 10, bonus: 0 },
          maxHP: 3295,
          maxMana: 640,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 46,
          manaRegenPer5s: 16,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 303, base: 303, bonus: 0 },
          magicAttack: { total: 10, base: 10, bonus: 0 },
          maxHP: 6106,
          maxMana: 1280,
          physicalDefense: { value: 360 },
          magicDefense: { value: 229 },
          attackSpeedBonusPct: 26,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 76,
          manaRegenPer5s: 32,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Mage',
          playPattern: 'Poke → Burst picker: spam S1 (CD 5 detik) dari jarak aman untuk stack pasif magic shred (maks 3 stack), lalu punish dengan S2 stun + S3 saat stack penuh. Efektif sebagai magic damage amplifier untuk tim dengan 2+ damage magis.',
          notes: [
            'Pola utama: stack Captivate lewat S1 poke → S2 stun lock → S3 burst untuk kill window.',
            'Bukan pembuka war; lebih aman bermain dari belakang dan follow-up setelah ada setup/frontline.',
            'Pasif magic shred sangat bernilai dalam komposisi double/triple magic damage.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'medium',
          late: 'high',
          notes: [
            'Early medium: S2 stun targeted reliable bahkan level 1, pasif magic shred aktif dari awal, musuh belum beli MR.',
            'Spike itemisasi (item ke-berapa) belum dimodelkan; sementara gunakan fase early/mid/late sebagai proxy.'
          ]
        },

        draftValues: {
          mobility: 'low',
          frontline: 'low',
          sustain: 'low',

          engage: 'low',
          disengage: 'low',
          peel: 'medium',

          cc: 'high',
          pickPotential: 'high',

          burst: 'high',
          dps: 'low'
        },

        crowdControl: [
          {
            source: 'skill2',
            effect: 'stun',
            delivery: 'targeted',
            reliability: 'high',
            durationSec: 1.5,
            notes: ['Stun single-target (lock-on) yang sangat reliable untuk pick atau peel 1 target.']
          }
        ],

        mobilityProfile: {
          level: 'low',
          uses: ['reposition'],
          notes: ['Tidak memiliki dash/blink dari kit dasar; positioning dan perlindungan tim sangat menentukan.']
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Kui', compatibilityPct: 2.51 },
            { externalName: 'Wuyan', compatibilityPct: 1.78 },
            { externalName: 'Zilong', compatibilityPct: 1.71 },
            { externalName: 'Arthur', compatibilityPct: 1.62 },
            { externalName: 'Yang Jian', compatibilityPct: 1.38 }
          ],
          trio: [
            { externalNames: ['Hou Yi', 'Ming'], compatibilityPct: 9.39 },
            { externalNames: ['Lian Po', 'Han Xin'], compatibilityPct: 8.70 },
            { externalNames: ['Hou Yi', 'Cai Yan'], compatibilityPct: 6.23 },
            { externalNames: ['Arthur', 'Kui'], compatibilityPct: 5.50 },
            { externalNames: ['Wukong', 'Donghuang'], compatibilityPct: 5.20 },
            { externalNames: ['Wuyan', 'Kui'], compatibilityPct: 3.93 },
            { externalNames: ['Kui', 'Yang Jian'], compatibilityPct: 3.56 },
            { externalNames: ['Zilong', 'Yang Jian'], compatibilityPct: 2.96 },
            { externalNames: ['Hou Yi', 'Sun Ce'], compatibilityPct: 2.95 },
            { externalNames: ['Lian Po', 'Hou Yi'], compatibilityPct: 2.86 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh frontline/peel agar Daji bisa posisi aman dan mencari pick.',
            'Butuh follow-up damage/tempo tim untuk mengonversi stun menjadi kill atau objektif.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Dive/backline pressure (assassin atau inisiator cepat) yang memaksa Daji out-of-position.',
            'Cleanse/CC immunity (jika ada) untuk meniadakan nilai stun single-target.',
            'MR stacking atau shielding yang menahan burst window.'
          ],
          notes: ['Jika stun ter-bait atau miss, Daji kehilangan window pick dan rawan dibalas.']
        },

        needsValidation: {
          questions: []
        }
      }
    },
    {
      id: 'lady_sun',
      name: 'Lady Sun',
      role: 'Farm Lane',
      secondaryRoles: [],

      tags: ['marksman', 'artillery', 'burst', 'late_game', 'physical', 'ranged', 'cooldown_cut'],

      // Boleh belum ada file gambarnya; UI tetap bagus karena ada gradient overlay.
      image: 'images/heroes/ladysun.png',

      profile: {
        type: 'Marksman',
        subtype: 'Artillery Marksman',
        uniqueness: ['Mendekati', 'Cleanup'],
        power: 'Late Game',
        lane: 'Farm Lane'
      },

      skills: {
        passive: {
          name: 'Energy Burst',
          categories: ['cooldown_cut'],
          rawDescription: 'Skill Pasif: Energy Burst (Cooldown)\nSaat Serangan Dasar Lady Sun menghantam target, Cooldown Skill 1 berkurang 0,5 Detik.',
          mechanics: {
            triggersOn: ['basic_attack_hit'],
            cooldownReduction: {
              targets: ['skill1'],
              cdReductionSec: 0.5,
              appliesToTargets: ['hero', 'minion', 'monster', 'tower', 'objective']
            }
          }
        },

        skill1: {
          name: 'Rolling Raid',
          cdSec: 5,
          manaCost: 20,
          categories: ['mobility', 'enhance', 'move_speed', 'physical', 'basic_attack_amp'],
          rawDescription: 'Skill 1: Rolling Raid (Gerakan, Tingkatkan, Gerak Cepat) (CD 5 Detik) Konsumsi Mana 20\nLady Sun berguling ke arah target dan meningkatkan Serangan Dasar berikutnya, yang akan menimbulkan 439 (270+100% Serangan Fisik) Damage Fisik pada musuh yang terhantam. Menggunakan Serangan Dasar Ditingkatkan akan mereset Serangan Dasar setelahnya dan menambahkan jangkauannya.\nJika ada Hero musuh di sekitar lokasi berguling, Kecepatan Gerakannya akan bertambah 80%. Efek ini akan lenyap secara bertahap 2 Detik.',
          mechanics: {
            delivery: 'dash',
            dash: {
              direction: 'towards_target',
              canPassThinWalls: true,
              notes: ['Bisa menembus dinding yang tidak terlalu tebal (thin wall).']
            },
            enhancedBasicAttack: {
              windowSec: 5,
              countsAsBasicAttack: true,
              damage: {
                physical: { baseDamage: 270, bonusPhysicalAttackPct: 100 }
              }
            },
            basicAttackReset: {
              appliesAfterEnhancedHit: true,
              notes: ['Menggunakan serangan dasar ditingkatkan akan mereset basic attack berikutnya.']
            },
            rangeBonus: {
              applies: true,
              appliesToHits: 2,
              hits: ['enhanced_basic_attack', 'next_basic_attack'],
              amount: 'unknown',
              notes: ['Bonus range kategori medium → hampir jauh; butuh angka unit untuk pasti.']
            },
            moveSpeedIfEnemyHeroNearby: {
              requiresEnemyHeroNearbyAtDashEnd: true,
              radius: 'medium',
              moveSpeedBonusPct: 80,
              durationSec: 2,
              decay: 'gradual',
              notes: ['Cek hero musuh di sekitar lokasi roll; radius kira-kira medium.']
            },
            needsValidation: {
              questions: [
                'Berapa jarak dash/roll (dalam unit)?',
                'Ambang ketebalan dinding yang masih bisa ditembus (thin wall threshold).',
                'Berapa radius cek "hero musuh di sekitar" yang memicu MS 80%?',
                'Berapa bonus range (dalam unit) dan apakah bonus range berlaku tepat untuk 2 hit seperti yang dicatat?'
              ]
            }
          }
        },

        skill2: {
          name: 'Frag Grenade',
          cdSec: 7.5,
          manaCost: 45,
          categories: ['enfeeble', 'slow', 'physical', 'damage', 'mark', 'basic_attack_amp'],
          rawDescription: 'Skill 2: Frag Grenade (Enfeeble, Slow, Damage Fisik) (CD 7,5 Detik) Konsumsi Mana 45\nLady Sun melemparkan granat ke lokasi target, menimbulkan 380 (380+100% Serangan Fisik ekstra) Damage Fisik, Slow Ekstrem selama 1 Detik, dan mengakibatkan pengurangan 10% Pertahanan Fisik pada musuh dalam jangkauan. Dia juga akan memberikan Mark pada Hero dan Minion musuh selama 5 Detik.\nSerangan Dasarnya menimbulkan 120 (120+30% Serangan Fisik ekstra) Damage Fisik tambahan pada Hero yang memiliki Mark dan 240 (240+60% Serangan Fisik ekstra) Damage Fisik tambahan pada Minion yang memiliki Mark.',
          mechanics: {
            delivery: 'aoe_ground',
            damage: {
              physical: { baseDamage: 380, bonusPhysicalAttackPct: 100 }
            },
            crowdControl: {
              effect: 'slow',
              durationSec: 1,
              slowPct: 'unknown',
              notes: ['Slow "ekstrem"; estimasi ~80–90% berdasarkan observasi, butuh angka pasti.']
            },
            debuffs: {
              physicalDefenseReductionPct: 10,
              durationSec: 5
            },
            mark: {
              durationSec: 5,
              appliesToTargets: ['hero', 'minion', 'monster', 'objective'],
              notes: [
                'Mark bisa diterapkan ke hero, minion, monster, dan objective (Tyrant/Overlord).',
                'Bonus damage basic attack hanya berlaku untuk target bertipe Hero dan Minion.'
              ]
            },
            bonusBasicAttackDamageVsMarked: {
              applies: true,
              onlyTargets: ['hero', 'minion'],
              hero: { physical: { baseDamage: 120, bonusPhysicalAttackPct: 30 } },
              minion: { physical: { baseDamage: 240, bonusPhysicalAttackPct: 60 } }
            },
            needsValidation: {
              questions: ['Berapa % slow "ekstrem" yang tepat (angka UI)?']
            }
          }
        },

        skill3: {
          name: 'Ultimate Shell',
          cdSec: 25,
          manaCost: 75,
          categories: ['physical', 'damage', 'burst'],
          rawDescription: 'Skill 3: Ultimate Shell (Damage Fisik) (CD 25 Detik) Konsumsi Mana 75\nLady Sun menembakkan peluru dahsyat ke arah target, menimbulkan 840 (840+210% Serangan Fisik ekstra) Damage Fisik pada musuh pertama yang terhantam. Saat menghantam musuh atau mencapai jarak maksimum, peluru itu akan terpencar dan menimbulkan 75% Damage pada musuh dalam area kerucut di belakang titik ledakan.',
          mechanics: {
            delivery: 'skillshot_line',
            projectile: {
              hitsFirstTargetOnly: true,
              validTargets: ['hero', 'minion', 'monster', 'objective'],
              range: 'long',
              notes: ['Musuh pertama termasuk semua unit (hero, minion, monster, objective); bisa ter-block oleh wave/jungle.']
            },
            directHit: {
              appliesWhen: 'hits_target',
              damage: {
                physical: { baseDamage: 840, bonusPhysicalAttackPct: 210 }
              }
            },
            shatterCone: {
              triggersOn: ['hit_target', 'max_range'],
              delivery: 'skillshot_cone',
              direction: 'behind_impact_point',
              damageMultiplier: 0.75,
              angleDeg: 45,
              range: 'short',
              notes: [
                'Jika peluru hit target sebelum area cone, target tersebut hanya menerima damage awal (cone mengenai area di belakang titik impact).',
                'Jika peluru mencapai jarak maksimum tanpa mengenai target, hanya damage cone yang berlaku.'
              ]
            },
            needsValidation: {
              questions: [
                'Berapa jarak maksimum proyektil (dalam unit)?',
                'Panjang cone (dalam unit) dan validasi angle cone ~45°.'
              ]
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 179, base: 179, bonus: 0 },
          maxHP: 3329,
          maxMana: 600,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 10,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 40,
          manaRegenPer5s: 15,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 390, base: 390, bonus: 0 },
          maxHP: 6143,
          maxMana: 1200,
          physicalDefense: { value: 339 },
          magicDefense: { value: 178 },
          attackSpeedBonusPct: 38,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 69,
          manaRegenPer5s: 30,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Marksman',
          playPattern:
            'Kiting marksman dengan burst window (S1 enhanced + ultimate) + setup mark (S2) untuk cleanup; unggul saat fight memanjang karena CD S1 dipotong basic attack.',
          engageRole: 'secondary',
          notes: [
            'S1 bisa tembus thin wall untuk reposition; pasif bikin S1 lebih sering tersedia jika bisa free-hit.',
            'Ultimate adalah long-range finisher/poke, tapi bisa ter-block oleh minion/monster/objective (butuh angle & wave control).'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'medium',
          late: 'high',
          notes: [
            'Puncak value muncul saat item/attack speed tinggi: pasif mempercepat siklus S1 dan meningkatkan uptime reposition/burst.'
          ]
        },

        draftValues: {
          mobility: 'medium',
          frontline: 'low',
          sustain: 'low',

          engage: 'low',
          disengage: 'medium',
          peel: 'low',

          cc: 'medium',
          pickPotential: 'medium',

          burst: 'high',
          dps: 'high'
        },

        crowdControl: [
          {
            source: 'skill2',
            effect: 'slow',
            delivery: 'aoe_ground',
            reliability: 'high',
            durationSec: 1,
            notes: [
              'Slow "ekstrem" (angka % belum pasti; estimasi ~80–90%).',
              'Bisa dipakai sebagai setup untuk ultimate atau untuk self-peel singkat.'
            ]
          }
        ],

        mobilityProfile: {
          level: 'medium',
          uses: ['reposition', 'chase'],
          notes: [
            'S1 adalah dash/roll (bisa lewat thin wall) + MS burst jika ada hero di sekitar roll.',
            'Pasif memotong CD S1 per basic hit → mobilitas meningkat jika Lady Sun bisa free-hit.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [{ externalName: 'Ming', compatibilityPct: 6.71 }],
          trio: [
            { externalNames: ['Liu Bang', 'Ming'], compatibilityPct: 8.96 },
            { externalNames: ['Kongming', 'Ming'], compatibilityPct: 7.87 },
            { externalNames: ['Nakoruru', 'Ming'], compatibilityPct: 7.43 },
            { externalNames: ['Ming', 'Ata'], compatibilityPct: 7.18 },
            { externalNames: ['Xuance', 'Ming'], compatibilityPct: 6.67 },
            { externalNames: ['Athena', 'Ming'], compatibilityPct: 6.64 },
            { externalNames: ['Menki', 'Ming'], compatibilityPct: 6.47 },
            { externalNames: ['Liu Bei', 'Ming'], compatibilityPct: 6.22 },
            { externalNames: ['Musashi', 'Dyadia'], compatibilityPct: 5.01 },
            { externalNames: ['Sun Bin', 'Mayene'], compatibilityPct: 4.13 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh frontline/peel agar Lady Sun bisa free-hit dan memanfaatkan pengurangan CD Skill 1 dari pasif.',
            'Butuh kontrol wave/tempo lane agar ultimate tidak mudah ke-block minion saat cari pick.',
            'Lebih nyaman dengan tim yang bisa lock/zone singkat untuk memastikan ult/burst connect.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Dive/backline pressure + hard CC yang memaksa Lady Sun tidak bisa auto-attack (memutus loop pasif → S1 jarang).',
            'Body-block ultimate dengan minion/monster/objective; paksa fight di wave musuh.',
            'Disengage/spacing yang memaksa Lady Sun tidak bisa stay dalam range basic attack.'
          ],
          notes: ['Jika Lady Sun tidak bisa hit basic dengan konsisten, impact turun karena pasif (CD cut S1) tidak jalan.']
        },

        needsValidation: {
          questions: [
            'Angka pasti % slow "ekstrem" dari Skill 2 (Frag Grenade).',
            'Jarak dash/roll dan angka bonus range dari Skill 1 (Rolling Raid).',
            'Jarak maksimum proyektil dan panjang cone Ultimate (Ultimate Shell).'
          ]
        }
      }
    },
    {
      id: 'houyi',
      name: 'Hou Yi',
      role: 'Farm Lane',
      secondaryRoles: [],

      tags: ['marksman', 'dps', 'late_game', 'physical', 'ranged', 'cc', 'initiate', 'stun', 'slow', 'vision'],

      image: 'images/heroes/houyi.png',

      profile: {
        type: 'Marksman',
        subtype: 'DPS Marksman',
        uniqueness: ['CC', 'Beraksi'],
        power: 'Late Game',
        lane: 'Farm Lane'
      },

      skills: {
        passive: {
          name: 'Chastising Shot',
          categories: ['enhance', 'attack_speed', 'dps', 'basic_attack_amp', 'multi_shot'],
          rawDescription: 'Skill Pasif: Chastising Shot (Tingkatkan)\nHou Yi mendapatkan 1 tumpukan Chastising Shot setiap kali Serangan Dasarnya menghantam musuh, maks 3 tumpukan. Setiap tumpukan meningkatkan Kecepatan Serangannya sebesar 2%-4% selama 3 Detik.\nSaat tumpukan maks, kekuatannya meningkat selama 3 Detik, Serangan Dasarnya menembakkan 3 anak panah (dianggap sebagai 1 Serangan Dasar) yang menimbulkan total 120% Serangan Dasar biasanya sebagai Damage Fisik.',
          mechanics: {
            chastisingShot: {
              stacks: {
                max: 3,
                durationSec: 3,
                durationRefreshesOnApply: true,
                gainedBy: ['basic_attack_hit'],
                attackSpeedBonusPerStackPct: { min: 2, max: 4, scalesWithLevel: true }
              },
              empoweredAtMaxStacks: {
                durationSec: 3,
                basicAttack: {
                  arrows: 3,
                  countsAsSingleBasicAttack: true,
                  totalDamageMultiplier: 1.2,
                  damageType: 'physical',
                  onHitTriggersPerBasicAttack: 1,
                  critAppliesNormally: true,
                  lifestealAppliesNormally: true
                },
                notes: [
                  'Stack bertahan (dan durasi refresh) selama Hou Yi terus menyerang. Jika berhenti menyerang, stack hilang setelah 3 detik.',
                  'Multi-shot dianggap 1 basic attack untuk on-hit (proc hanya 1x). Crit dan lifesteal tetap normal.'
                ]
              }
            }
          }
        },

        skill1: {
          name: 'Arrow Volley',
          cdSec: 10,
          manaCost: 50,
          categories: ['enhance', 'physical', 'dps'],
          rawDescription: 'Skill 1: Arrow Volley (Tingkatkan) (CD 10 Detik) Konsumsi Mana 50\nHou Yi meningkatkan Serangan Dasarnya untuk menimbulkan 214 (90+75% Serangan Fisik) Damage Fisik. Selama peningkatan Pasif ini aktif, menggunakan Skill 1 akan membuat anak panahnya menimbulkan total 120% dari Serangan Dasar biasanya sebagai Damage Fisik, plus 50% Damage pada 2 musuh lain atau Tower atau Kristal dalam jangkauan di depannya (tanpa efek On-Hit). Efek ini aktif selama 5 Detik.',
          mechanics: {
            durationSec: 5,
            basicAttackBonusDamage: {
              physical: { baseDamage: 90, bonusPhysicalAttackPct: 75 }
            },
            chainedShots: {
              extraTargets: 2,
              targetSelection: {
                mode: 'nearest_in_front',
                priority: 'enemy_hero',
                canHitStructures: true
              },
              extraTargetDamageMultiplierOfPrimary: 0.5,
              appliesOnHit: false,
              notes: [
                'S1 bisa digunakan tanpa pasif max stacks; dalam kondisi itu tidak ada multi-shot pasif (target utama menerima basic normal).',
                'Jika pasif sedang empowered (max stacks), target utama mengikuti multi-shot pasif, dan S1 menambah 2 target tambahan terdekat (hero prioritas).'
              ]
            }
          }
        },

        skill2: {
          name: 'Afterglow',
          cdSec: 7,
          manaCost: 40,
          categories: ['magic', 'slow', 'vision'],
          rawDescription: 'Skill 2: Afterglow (Damage Magis, Slow, Vision) (CD 7 Detik) Konsumsi Mana 40\nHou Yi memerintahkan Sun Tower untuk menyerang dan memperlihatkan area target. Setelah jeda singkat, menimbulkan 480 (480+110% Serangan Fisik ekstra) Damage Magis pada musuh dalam jangkauan dan mengurangi Kecepatan Gerakan mereka sebesar 25-50% selama 2 Detik. Musuh di tepi area Skill hanya menerima setengah dari Damage dan Slow.',
          mechanics: {
            delivery: 'aoe_ground',
            delaySec: 1,
            vision: {
              revealsArea: true,
              durationSec: 2
            },
            damage: {
              magic: { baseDamage: 480, bonusPhysicalAttackPct: 110 }
            },
            slow: {
              pct: { min: 25, max: 50, scalesWithLevel: true },
              durationSec: 2
            },
            edgeFalloff: {
              multiplier: 0.5,
              appliesTo: ['damage', 'slow']
            },
            notes: [
              'Delay dan durasi vision berdasar observasi: delay ~1 detik, vision ~2 detik.',
              'Radius area belum dicatat; akan dilengkapi saat ada referensi lebih jelas.'
            ]
          }
        },

        skill3: {
          name: 'Burning Sun Arrow',
          cdSec: 45,
          manaCost: 130,
          categories: ['cc', 'slow', 'physical'],
          rawDescription: 'Skill 3: Burning Sun Arrow (CC, Slow, Damage Fisik) (CD 45 Detik) Konsumsi Mana 130\nHou Yi menembakkan Flaming Arrow ke arah target yang meledak ketika menghantam Hero musuh. Ledakan ini menimbulkan 800 (800+120% Serangan Fisik ekstra) Damage Fisik pada musuh dalam jangkauan. Panah ini mengakibatkan Stun selama 0,75-3,5 Detik (tergantung jarak terbang panah) pada musuh yang pertama terhantam, serta Slow sebesar 30% selama 1 Detik pada musuh dalam jangkauan ledakan.',
          mechanics: {
            delivery: 'skillshot_line',
            projectile: {
              piercesNonHeroes: true,
              detonatesOn: 'first_enemy_hero_hit',
              disappearsIfNoHeroHit: true
            },
            damage: {
              physical: { baseDamage: 800, bonusPhysicalAttackPct: 120 }
            },
            crowdControl: {
              stun: {
                target: 'first_hero_hit',
                durationSec: { min: 0.75, max: 3.5, scalesWith: 'travel_distance' }
              },
              slow: {
                target: 'explosion_aoe',
                pct: 30,
                durationSec: 1,
                affectsPrimaryTarget: true
              }
            },
            notes: [
              'Panah menembus minion/monster dan hanya meledak saat mengenai hero musuh pertama. Jika tidak mengenai hero, panah hilang.',
              'Radius ledakan belum dicatat; akan dilengkapi saat ada referensi lebih jelas.'
            ]
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 176, base: 166, bonus: 10 },
          maxHP: 3362,
          maxMana: 600,
          physicalDefense: { value: 150, damageReductionPct: 20 },
          magicDefense: { value: 75, damageReductionPct: 11.1 },
          attackSpeedBonusPct: 10,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 370,
          hpRegenPer5s: 41,
          manaRegenPer5s: 15,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 367, base: 357, bonus: 10 },
          maxHP: 6535,
          maxMana: 1200,
          physicalDefense: { value: 336, damageReductionPct: 35.8 },
          magicDefense: { value: 187, damageReductionPct: 23.7 },
          attackSpeedBonusPct: 38,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 370,
          hpRegenPer5s: 71,
          manaRegenPer5s: 30,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Marksman',
          playPattern: 'Late-game DPS marksman (free-hit) + long-range pick tool: output DPS lewat pasif multi-shot (3 panah saat max stack) + S1 chain shot. S3 bukan reliable opener — lebih efektif sebagai follow-up CC jarak jauh (stun 0.75–3.5 detik scaling jarak) saat musuh sudah terkena setup tim atau tidak bergerak.',
          engageRole: 'secondary',
          notes: [
            'Hou Yi adalah marksman DPS dengan scaling late game; butuh ruang tembak dan perlindungan tim.',
            'S3 paling efektif sebagai follow-up pick/CC jarak jauh, bukan pembuka fight — stun pendek di jarak dekat, susah kena saat musuh masih bebas bergerak.',
            'Tidak punya dash/escape — sangat rentan dive; bergantung penuh pada frontline/peel tim.'
          ]
        },

        powerCurve: {
          early: 'low',
          mid: 'medium',
          late: 'high',
          notes: ['Power utama di late game (sesuai data).']
        },

        draftValues: {
          mobility: 'low',
          frontline: 'low',
          sustain: 'low',

          engage: 'low',
          disengage: 'low',
          peel: 'medium',

          cc: 'high',
          pickPotential: 'high',

          burst: 'medium',
          dps: 'high'
        },

        crowdControl: [
          {
            source: 'skill2',
            effect: 'slow',
            delivery: 'aoe_ground',
            reliability: 'medium',
            durationSec: 2,
            notes: [
              'Slow 25-50% selama 2 detik (scaling level).',
              'Ada delay ~1 detik sebelum kena. Musuh di tepi area hanya kena setengah damage + slow.'
            ]
          },
          {
            source: 'skill3',
            effect: 'stun',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 0.75,
            durationSecMax: 3.5,
            notes: ['Stun pada hero pertama yang terhantam; durasi scaling jarak terbang panah (min 0,75s sampai 3,5s).']
          },
          {
            source: 'skill3',
            effect: 'slow',
            delivery: 'aoe_ground',
            reliability: 'high',
            durationSec: 1,
            notes: ['Ledakan memberi slow 30% selama 1 detik pada semua musuh di area, termasuk target utama.']
          }
        ],

        mobilityProfile: {
          level: 'low',
          uses: ['reposition'],
          notes: [
            'Tidak memiliki dash/escape; positioning dan peel/frontline tim menentukan apakah Hou Yi bisa free-hit.',
            'Jika dipaksa reposition oleh dive/CC, output DPS turun drastis.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Ming', compatibilityPct: 6.18 },
            { externalName: 'Zhuangzi', compatibilityPct: 3.17 },
            { externalName: 'Cai Yan', compatibilityPct: 2.78 },
            { externalName: 'Liu Bang', compatibilityPct: 2.46 },
            { externalName: 'Athena', compatibilityPct: 1.79 }
          ],
          trio: [
            { externalNames: ['Liu Bang', 'Ming'], compatibilityPct: 11.7 },
            { externalNames: ['Athena', 'Ming'], compatibilityPct: 10.06 },
            { externalNames: ['Dun', 'Ming'], compatibilityPct: 9.66 },
            { externalNames: ['Daji', 'Ming'], compatibilityPct: 9.39 },
            { externalNames: ['Kongming', 'Ming'], compatibilityPct: 7.48 },
            { externalNames: ['Nakoruru', 'Ming'], compatibilityPct: 7.12 },
            { externalNames: ['Daji', 'Cai Yan'], compatibilityPct: 6.23 },
            { externalNames: ['Arthur', 'Ming'], compatibilityPct: 6.07 },
            { externalNames: ['Zilong', 'Cai Yan'], compatibilityPct: 5.96 },
            { externalNames: ['Dian Wei', 'Ming'], compatibilityPct: 5.95 },
            { externalNames: ['Daji', 'Sun Ce'], compatibilityPct: 2.95 },
            { externalNames: ['Lian Po', 'Daji'], compatibilityPct: 2.86 },
            { externalNames: ['Kongming', 'Allain'], compatibilityPct: 2.64 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh frontline/peel untuk melindungi marksman agar bisa output DPS dengan aman.',
            'Butuh setup/lockdown dari tim agar damage berkelanjutan bisa dikonversi menjadi kill/objektif.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Dive/backline pressure yang memaksa marksman tidak bisa free hit.',
            'Hard CC/lockdown pada marksman.',
            'Disengage kuat untuk memutus window DPS.'
          ]
        },

        needsValidation: {
          questions: []
        }
      }
    },
    {
      id: 'haya',
      name: 'Haya',
      role: 'Mid Lane',
      secondaryRoles: [],

      tags: ['mage', 'artillery', 'poke', 'ranged', 'mid_lane', 'magic', 'cc', 'mark', 'enhance', 'basic_attack_amp', 'ammo', 'true_damage', 'shield', 'stun', 'mobility', 'damage_reduction', 'cooldown_cut'],

      // Boleh belum ada file gambarnya; UI tetap bagus karena ada gradient overlay.
      image: 'images/heroes/haya.png',

      profile: {
        traits: ['CC', 'Late Game'],
        type: 'Mage',
        subtype: 'Artillery Mage',
        uniqueness: ['Ranged Poke'],
        power: 'Early Game',
        lane: 'Mid Lane'
      },

      skills: {
        passive: {
          name: 'Moon Farewell',
          categories: ['mark', 'enhance', 'magic', 'ammo', 'basic_attack_amp'],
          rawDescription: 'Skill Pasif: Moon Farewell (Mark, Tingkatkan, Damage Magis)\nHaya memiliki 3 Kristal Bulan di belakangnya. Saat Skill 1 atau Skill 2 digunakan, 1 Kristal Bulan akan dikonsumsi. Saat Kristal Bulan habis, kedua Skill ini memasuki Cooldown sepenuhnya dan Serangan Dasarnya ditingkatkan dengan menembakkan 3 Orb tambahan, masing-masing menimbulkan 50 (50+10% Serangan Magis) Damage Magis. Skill 1 atau Skill 2 akan menerapkan Mark pada target yang terhantam. Jika target yang memiliki Mark terkena hantaman lagi, efek yang berbeda akan terpicu.',
          mechanics: {
            moonCrystals: {
              max: 3,
              sharedBetweenSkills: ['skill1', 'skill2'],
              consumedPerCast: 1,
              recharge: {
                applies: true,
                startsOnUse: true,
                fullRefillSec: 7,
                affectedByCooldownReduction: true,
                notes: [
                  'Crystal mulai recovery otomatis begitu ada pemakaian (walau baru 1 cast).',
                  'Waktu refill dari 0 sampai full mengikuti cooldown skill (base 7 detik; dipercepat oleh CDR).' 
                ]
              },
              onDepleted: {
                fullCooldownSkills: ['skill1', 'skill2'],
                notes: ['Saat crystal 0/3, Skill 1 & Skill 2 masuk cooldown sepenuhnya.']
              }
            },
            enhancedBasicAttackWhenCrystalsDepleted: {
              applies: true,
              triggers: ['on_crystals_depleted'],
              grantsNextEnhancedBasicAttack: {
                uses: 1,
                additionalOrbs: {
                  count: 3,
                  damageEach: {
                    magic: { baseDamage: 50, bonusMagicAttackPct: 10 }
                  }
                },
                notes: ['Saat crystal habis (0/3), Haya hanya mendapat 1 enhanced basic attack (sekali) yang menambah 3 orb.']
              }
            },
            mark: {
              appliedBy: ['skill1', 'skill2'],
              durationSecApprox: 4.5,
              notes: ['Durasi Mark kira-kira 4–5 detik.'],
              trigger: {
                on: 'rehit_marked_target',
                effect: 'varies_by_skill',
                notes: ['Detail efek saat target bertanda terkena hit lagi akan dilengkapi per-skill (contoh: bonus true damage pada Skill 1).']
              }
            },
            needsValidation: {
              questions: [
                'Jika enhanced basic attack (1x) tidak dipakai, apakah hangus saat crystal kembali > 0 atau tetap bisa dipakai sampai digunakan?',
                'Durasi Mark yang tepat: 4 atau 5 detik (atau scaling)?',
                'Apakah diminishing stun Skill 2 bisa reset jika selingi Skill 1, atau hanya reset saat Mark habis?'
              ]
            }
          }
        },

        skill1: {
          name: 'Crescent Wave',
          cdSec: 7,
          manaCost: 30,
          categories: ['magic', 'true_damage', 'mark'],
          rawDescription: 'Skill 1: Crescent Wave (Damage Magis, True Damage) (CD 7 Detik) Konsumsi Mana 30\nHaya menembakkan energi dari cahaya Bulan yang menimbulkan 350 (350+75% Serangan Magis) Damage Magis. Menghantam target yang memiliki Mark akan menimbulkan 100 (100+22% Serangan Magis) True Damage tambahan.',
          mechanics: {
            delivery: 'skillshot_line',
            line: {
              range: 'long',
              passesThroughUnits: true
            },
            damage: {
              magic: { baseDamage: 350, bonusMagicAttackPct: 75 }
            },
            appliesMarkFromPassive: true,
            bonusTrueDamageIfTargetHasMark: {
              requiresPreexistingMark: true,
              doesNotConsumeMark: true,
              markDurationSecApprox: 4.5,
              trueDamage: { baseDamage: 100, bonusMagicAttackPct: 22 },
              notes: ['Bonus true damage hanya aktif jika target sudah punya Mark sebelum terkena hit. Mark tidak dikonsumsi dan bertahan ~4–5 detik.']
            }
          }
        },

        skill2: {
          name: 'Wayward Ray',
          cdSec: 7,
          manaCost: 30,
          categories: ['shield', 'cc', 'magic', 'stun', 'move_speed', 'mark', 'multi_hit'],
          rawDescription: 'Skill 2: Wayward Ray (Shield, CC, Damage Magis) (CD 7 Detik) Konsumsi Mana 30\nHaya menembakkan 3 Orb, Orb pertama menimbulkan 120 (120+22% Serangan Magis) Damage Magis, dan kedua Orb lainnya menimbulkan 60 (60+11% Serangan Magis) Damage Magis. Selain itu, dia juga mendapatkan Shield yang menangkal 250 (250+40% Serangan Magis) Damage selama 3 Detik, dan peningkatan Kecepatan Gerakan secara bertahap (maks 30%) selama 2 Detik. Menghantam musuh yang memiliki Mark akan mengakibatkan Stun selama 0,5 Detik, tapi hantaman selanjutnya hanya mengakibatkan 50% dari nilai efek Stun awal.',
          mechanics: {
            delivery: 'targeted',
            projectiles: {
              count: 3,
              targeting: 'lock_on_target',
              behaviorIfTargetDies: 'continue_to_last_known_position',
              canHitOtherUnitsAtImpactPoint: true
            },
            damage: {
              orb1: { magic: { baseDamage: 120, bonusMagicAttackPct: 22 } },
              orb2And3: { count: 2, magicEach: { baseDamage: 60, bonusMagicAttackPct: 11 } }
            },
            shield: {
              amount: { flat: 250, bonusMagicAttackPct: 40 },
              durationSec: 3
            },
            moveSpeed: {
              maxBonusPct: 30,
              durationSec: 2,
              ramp: 'gradual'
            },
            appliesMarkFromPassive: true,
            crowdControl: {
              stun: {
                requiresPreexistingMark: true,
                durationSec: 0.5,
                diminishing: {
                  applies: true,
                  subsequentDurationMultiplier: 0.5,
                  scope: 'same_target_while_mark_active',
                  subsequentDurationSec: 0.25
                },
                notes: [
                  'Jika target tidak memiliki Mark sebelum cast, Skill 2 hanya memasang Mark dan tidak memicu stun pada cast yang sama.',
                  'Jika Skill 2 dilempar beruntun pada target yang sama selama Mark masih aktif, stun berikutnya menjadi 50% (0,25 detik).'
                ]
              }
            }
          }
        },

        skill3: {
          name: 'Moonscape Mirage',
          cdSec: 75,
          manaCost: 70,
          categories: ['dreamscape', 'cd', 'shield', 'damage_reduction', 'cooldown_cut', 'blink', 'duel'],
          rawDescription: 'Skill 3: Moonscape Mirage (Dreamscape, CD, Shield) (CD 75 Detik) Konsumsi Mana 70\nHaya bertautan dengan satu Hero selama 1,5 Detik dan mendapatkan 50% Reduksi Damage. Tautan terputus jika target terlalu jauh darinya dan CD Ultimate berkurang 75%. Jika tidak terputus selama 1,5 Detik, dia dan target memasuki Dimensi Mirage, lalu memberikan Shield yang menangkal 300 (300+70% Serangan Magis) Damage dan CD Skill miliknya berkurang 50%. Menggunakan Ultimate lagi saat berada di dalam Dimensi Mirage membuatnya bergerak sejauh 700 unit dari target.',
          mechanics: {
            delivery: 'targeted',
            tether: {
              durationSec: 1.5,
              selfDamageReductionPct: 50,
              breaksIfTooFar: true,
              onBreak: {
                ultimateCooldownRefundPct: 75,
                notes: ['Jika tether putus karena jarak, cooldown ultimate dipotong 75% (refund).']
              }
            },
            mirageDimension: {
              entersOnSuccessfulTether: true,
              durationSecApprox: 7.5,
              isolatedDuel: true,
              participants: ['haya', 'target'],
              cannotBeInterferedByOutsideUnits: true,
              returnToStartPositionOnEnd: true,
              notes: ['Saat durasi dimensi habis, posisi kembali ke lokasi awal sebelum masuk dimensi.']
            },
            buffsInMirage: {
              shield: {
                target: 'self',
                amount: { flat: 300, bonusMagicAttackPct: 70 }
              },
              cooldownReduction: {
                cdrPct: 50,
                appliesWhileInMirage: true,
                notes: ['CDR 50% ini bersifat buff selama di dimensi (bukan refund instan).']
              }
            },
            recastInMirage: {
              enabled: true,
              repositionDistanceUnits: 700,
              direction: 'away_from_target',
              cdSecApprox: 6,
              maxUsesApprox: 2,
              notAffectedByMirageCooldownReduction: true,
              notes: [
                'Recast ultimate saat di dimensi selalu otomatis menjauh dari target.',
                'Recast memiliki cooldown sekitar 6 detik sehingga umumnya bisa dipakai hingga 2 kali dalam 1 dimensi.',
                'Cooldown recast tidak dipercepat oleh buff CDR 50% di Dimensi Mirage.'
              ]
            },
            needsValidation: {
              questions: [
                'Berapa jarak maksimal sebelum tether putus (break range)?',
                'Durasi Dimensi Mirage yang tepat: 7 atau 8 detik (atau scaling)?'
              ]
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 158, base: 158, bonus: 0 },
          magicAttack: { total: 10, base: 0, bonus: 10 },
          maxHP: 3212,
          maxMana: 640,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 44,
          manaRegenPer5s: 16,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 279, base: 279, bonus: 0 },
          magicAttack: { total: 10, base: 0, bonus: 10 },
          maxHP: 6119,
          maxMana: 1280,
          physicalDefense: { value: 360 },
          magicDefense: { value: 215 },
          attackSpeedBonusPct: 26,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 75,
          manaRegenPer5s: 32,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Mage',
          engageRole: 'secondary',
          playPattern: 'Artillery poke mage + counter-diver: spam S1/S2 dari jarak aman untuk stack Mark, lalu punish re-hit (S1 true damage / S2 stun). S3 dipakai untuk isolate diver yang masuk ke backline (culik musuh yang masuk, bukan masuk ke musuh) — tim bebas fight 4v4 selama dimensi 7–8 detik. Cocok berpasangan dengan Marksman karena S2 shield/MS + S3 counter-diver.',
          notes: [
            'Core pattern: apply Mark (S1/S2) → re-hit target ber-Mark untuk bonus (S1 true damage / S2 stun).',
            'Resource: Moon Crystal (3 stack) bikin Haya bisa spam S1/S2 sampai stack habis; refill full mengikuti cooldown skill dan dipercepat oleh CDR.',
            'S3 paling efektif sebagai counter-engage: tunggu diver masuk ke backline, lalu isolate — bukan dipakai untuk masuk ke kerumunan musuh.',
            'S3 mengembalikan Haya ke posisi awal setelah dimensi selesai; plan positioning sebelum cast.'
          ]
        },

        powerCurve: {
          early: 'high',
          mid: 'medium',
          late: 'high',
          notes: [
            'Early kuat karena base damage + range poke + shield/MS untuk trading.',
            'Mid cenderung nanggung karena butuh item untuk scaling.',
            'Late kembali kuat saat item lengkap (scaling berbasis item, bukan growth level).'
          ]
        },

        draftValues: {
          mobility: 'medium',
          frontline: 'low',
          sustain: 'low',

          engage: 'low',
          disengage: 'medium',
          peel: 'medium',

          cc: 'medium',
          pickPotential: 'high',

          burst: 'high',
          dps: 'low'
        },

        crowdControl: [
          {
            source: 'skill2',
            effect: 'stun',
            delivery: 'targeted',
            reliability: 'medium',
            durationSec: 0.5,
            notes: [
              'Stun hanya keluar jika target sudah punya Mark sebelum cast.',
              'Jika Skill 2 dipakai beruntun ke target yang sama selama Mark masih aktif, stun berikutnya menjadi 0,25 detik (50%).'
            ]
          }
        ],

        mobilityProfile: {
          level: 'medium',
          uses: ['reposition', 'escape', 'chase'],
          notes: [
            'Mobility utama dari MS ramp S2 dan reposition S3 (recast) saat berada di Dimensi Mirage.',
            'S3 mengembalikan Haya ke posisi awal saat dimensi selesai—risiko positioning ditentukan saat cast awal.'
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh frontline/space agar Haya bisa pasang Mark lewat poke tanpa dipaksa all-in duluan.',
            'Butuh vision/setup agar S1 (long skillshot) konsisten connect ke target prioritas.',
            'Tim harus bisa memanfaatkan window S3 (musuh “hilang” 7–8 detik) untuk objektif/tempo.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { heroId: 'dolia', compatibilityPct: 3.49 },
            { externalName: 'Flowborn (Marksman)', compatibilityPct: 2.24 }
          ],
          trio: [
            { externalNames: ['Dolia', 'Yang Jian'], compatibilityPct: 7.72 },
            { externalNames: ['Dolia', 'Flowborn (Marksman)'], compatibilityPct: 7.59 }
          ]
        },

        counterplay: {
          counteredBy: [
            'Putuskan tether S3 dengan keluar jarak (gagal masuk dimensi).',
            'Hindari status Mark agar bonus true damage/stun tidak aktif (dodge S1, jaga spacing vs S2).',
            'Hard engage/burst cepat saat Haya tidak punya shield/MS atau saat Moon Crystal sedang rendah.'
          ]
        },

        needsValidation: {
          questions: []
        }
      }
    },
    {
      id: 'dolia',
      name: 'Dolia',
      role: 'Roaming',
      secondaryRoles: [],

      tags: ['support', 'buff', 'late_game', 'ranged', 'cc', 'slow', 'sustain', 'recovery', 'heal', 'mobility'],

      // Image optional. Jika kamu sudah punya asset-nya, simpan di path ini.
      image: 'images/heroes/dolia.png',

      profile: {
        type: 'Support',
        subtype: 'Support Buff',
        uniqueness: ['Buff Tim'],
        power: 'Late Game',
        lane: 'Roaming'
      },

      skills: {
        passive: {
          name: "Mermaid's Gift",
          categories: ['recovery', 'sustain', 'utility', 'form_change'],
          rawDescription: "Skill Pasif: Mermaid's Gift (Recovery)\nSelama berada di air, Dolia berubah menjadi putri duyung, mengurangi Slow sebesar 50%, serta memulihkan 60 (60+1% HP ekstra) HP dan Mana setiap Detik. Serangan Dasarnya pun menimbulkan Damage Area.\n(Skill Recovery miliknya berubah menjadi Mermaid's Gift yang bisa digunakan untuk membentuk Covenant dengan rekan tim yang dipilih. Rekan tim tersebut akan menjadi target prioritas untuk Ultimate)",
          mechanics: {
            condition: {
              inWater: true,
              notes: ['Air bisa berasal dari map dan/atau kolam dari Skill 2.']
            },
            slowEffectivenessReductionPct: 50,
            regenPerSec: {
              hp: { flat: 60, bonusHpPct: 1 },
              mana: { flat: 60, bonusHpPct: 1 }
            },
            basicAttack: {
              becomesAoe: true
            },
            recoverySkillOverrideInWater: {
              newSkillName: "Mermaid's Gift",
              covenant: {
                permanent: true,
                switchTargetCdSec: 10,
                cannotBreak: true,
                ultimatePriorityTargetWhenNearby: true,
                notes: [
                  'Covenant berfungsi sebagai prioritas: jika target covenant dekat dengan Dolia, Ultimate memprioritaskan target tersebut.'
                ]
              }
            }
          }
        },

        skill1: {
          name: 'Ode',
          cdSec: 12,
          manaCost: 50,
          categories: ['magic', 'damage', 'cc'],
          rawDescription: 'Skill 1: Ode (Damage Magis, CC) (CD 12 Detik) Konsumsi Mana 50\nDolia menyanyi, mengeluarkan 4 gelombang suara ke sekelilingnya. 3 gelombang suara pertama menimbulkan 130 (130+20% Serangan Magis) Damage Magis dan 7,5% Slow. Sedangkan gelombang suara ke 4 menimbulkan 250 (250+40% Serangan Magis) Damage Magis dan 30% Slow selama 1 Detik.\nGelombang suara ini memicu Echo ketika menghantam musuh, menimbulkan 150 (150+24% Serangan Magis) Damage Magis. Saat berada di dalam air, gelombang suara akan memukul mundur musuh di sekitar dan mengakibatkan Stun pada musuh yang berada sangat dekat dengannya.\n(Echo yang terpicu oleh Non-Hero memiliki jangkauan yang lebih pendek dan hanya menimbulkan 50% Damage)',
          mechanics: {
            delivery: 'aoe_self',
            waves: {
              count: 4,
              firstThree: {
                damage: { magic: { baseDamage: 130, bonusMagicAttackPct: 20 } },
                slow: {
                  pct: 7.5,
                  notes: ['Slow terjadi saat musuh terkena gelombang (tidak ada informasi durasi linger terpisah).']
                }
              },
              fourth: {
                damage: { magic: { baseDamage: 250, bonusMagicAttackPct: 40 } },
                slow: { pct: 30, durationSec: 1 },
                inWaterBonus: {
                  knockback: {
                    applies: true,
                    notes: ['Hanya pada gelombang terakhir saat berada di air; efeknya sekilas.']
                  },
                  innerZoneStun: {
                    applies: true,
                    notes: ['Musuh yang sangat dekat kena stun; durasi terlihat sekilas (belum ada angka detik).']
                  }
                }
              }
            },
            echo: {
              triggersOn: 'wave_hit',
              damage: { magic: { baseDamage: 150, bonusMagicAttackPct: 24 } },
              nonHeroPenalty: {
                damageMultiplier: 0.5,
                shorterRange: true
              }
            }
          }
        },

        skill2: {
          name: 'Wavebreaker',
          cdSec: 12.5,
          manaCost: 75,
          categories: ['pool', 'dash', 'recovery'],
          rawDescription: 'Skill 2: Wavebreaker (Pool, Dash, Recovery) (CD 12,5 Detik) Konsumsi Mana 75\nDolia melompat ke depan dan berubah menjadi putri duyung. Jika dia mendarat di tanah kering, dia menciptakan kolam yang memulihkan 320 (320+40% Serangan Magis) HP dirinya dan rekan tim yang berada di kolamnya. Saat berada dalam kolam, HP dan Mana rekan tim akan dipulihkan dengan kecepatan yang sama dengan Dolia.\nJika digunakan dalam air, CD Skill berkurang 25%.\n(Jika dia meninggalkannya selama 4 Detik, kolam akan menghilang)',
          mechanics: {
            delivery: 'dash_forward',
            transformsIntoMermaid: true,
            pool: {
              createsIfLandOnDryGround: true,
              countsAsWater: true,
              disappearsAfterLeaveSec: 4
            },
            healing: {
              instant: {
                targets: ['self', 'allies_in_pool'],
                hp: { flat: 320, bonusMagicAttackPct: 40 },
                notes: ['Heal instan tetap terjadi saat skill digunakan di air (tanpa menciptakan kolam baru di tanah kering).']
              },
              shareRegenInsidePool: {
                targets: ['allies_in_pool'],
                matchesDoliaInWaterRegen: true,
                notes: [
                  'Saat berada dalam kolam, HP dan Mana rekan tim dipulihkan dengan kecepatan yang sama dengan Dolia.',
                  'Efek regen tetap berlaku selama kolam masih ada meskipun Dolia keluar kolam.'
                ]
              }
            },
            cooldownReductionWhenCastInWaterPct: 25,
            notes: ['Perlu validasi: apakah slow reduction 50% (mode putri duyung) juga berlaku untuk rekan tim yang berada di kolam?']
          }
        },

        skill3: {
          name: 'Celestial Melody',
          cdSec: 0,
          manaCost: 100,
          categories: ['reset_cd', 'utility', 'buff'],
          rawDescription: 'Skill 3: Celestial Melody (Reset CD) (CD 0 Detik) Konsumsi Mana 100\nDolia menyalurkan kekuatan selama waktu singkat, mereset CD Skill satu rekan tim dalam jangkauan. Skill yang direset adalah Skill dengan sisa CD paling lama. Sebagai gantinya, Dolia harus menanggung CD selama 10 (+120% dari CD Skill saat ini) Detik untuk dirinya sendiri.\nJika rekan timnya tidak menggunakan Skill yang direset, CD Celestial Melody berkurang 20%. Jika rekan tim menggunakan Skill yang direset dalam waktu 5 Detik, Skill tersebut tidak mengonsumsi Energi, dan perolehan dari mengalahkan musuh dengan Skill ini akan dibagi rata dengan Dolia.\n(Skill ini memprioritaskan rekan tim yang telah membentuk hubungan Covenant dengannya. Jika tidak ada rekan tim di sekitarnya, dia mereset salah satu Skillnya sendiri. Jika reset gagal, CD dari Celestial Melody berkurang secara signifikan)',
          mechanics: {
            delivery: 'targeted',
            channel: {
              applies: true,
              notes: ['Durasi channel belum dicatat.']
            },
            target: {
              type: 'ally',
              priority: ['covenant_ally', 'any_ally_in_range'],
              selfFallbackIfNoAllyNearby: true
            },
            reset: {
              selectsSkill: 'longest_remaining_cd',
              notes: ['Skill yang direset adalah skill dengan sisa CD paling lama.']
            },
            selfCooldownAfterCast: {
              baseSec: 10,
              plusPctOfResetSkillRemainingCd: 120,
              notes: ['CD yang ditanggung Dolia dihitung dari remaining CD skill yang direset (bukan base CD).']
            },
            allyFollowUpWindowSec: 5,
            allyIfUsesResetSkillWithinWindow: {
              energyCostIgnored: true,
              killRewardSplitWithDolia: true
            },
            allyIfDoesNotUseResetSkill: {
              celestialMelodyCooldownReductionPct: 20
            },
            resetFailure: {
              likelyCauses: ['target_dead'],
              notes: ['Jika reset gagal, CD Celestial Melody berkurang secara signifikan (nilai belum dicatat).']
            },
            needsValidation: {
              questions: ['Berapa persen/berapa detik pengurangan CD Celestial Melody saat reset gagal?']
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 170, base: 170, bonus: 0 },
          magicAttack: { total: 10, base: 10, bonus: 0 },
          maxHP: 3308,
          maxMana: 620,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 365,
          hpRegenPer5s: 46,
          manaRegenPer5s: 15,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 339, base: 339, bonus: 0 },
          magicAttack: { total: 10, base: 10, bonus: 0 },
          maxHP: 6764,
          maxMana: 1240,
          physicalDefense: { value: 388 },
          magicDefense: { value: 212 },
          attackSpeedBonusPct: 19,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 365,
          hpRegenPer5s: 95,
          manaRegenPer5s: 30,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Support',
          playPattern: 'Enchanter buffer: sustain zone + cooldown reset enabler',
          notes: [
            'Dolia adalah support enabler yang menguatkan tim lewat zona sustain (kolam/air) dan reset cooldown Ultimate.',
            'Covenant menentukan prioritas target Ultimate: idealnya dipasang ke core dengan skill cooldown panjang/impact besar.',
            'Nilai CC paling kuat muncul saat fight di air (knockback + stun pada gelombang terakhir Skill 1).'
          ]
        },

        powerCurve: {
          early: 'low',
          mid: 'medium',
          late: 'high',
          notes: [
            'Power late game tinggi karena Ultimate reset cooldown + sustain zone makin bernilai di teamfight/objective.',
            'Early game tetap punya utilitas (heal instan + regen di kolam), tetapi output damage/kill pressure rendah.'
          ]
        },

        draftValues: {
          mobility: 'medium',
          frontline: 'low',
          sustain: 'high',

          engage: 'low',
          disengage: 'medium',
          peel: 'high',

          cc: 'medium',
          pickPotential: 'low',

          burst: 'low',
          dps: 'low'
        },

        crowdControl: [
          {
            source: 'skill1.waves.firstThree',
            effect: 'slow',
            delivery: 'aoe_self',
            reliability: 'medium',
            notes: ['Slow kecil (7,5%) dari 3 gelombang awal; tidak ada informasi durasi linger terpisah.']
          },
          {
            source: 'skill1.waves.fourth',
            effect: 'slow',
            delivery: 'aoe_self',
            reliability: 'medium',
            durationSec: 1,
            notes: ['Gelombang ke-4 memberi slow 30% selama 1 detik.']
          },
          {
            source: 'skill1.waves.fourth.inWaterBonus',
            effect: 'knockback',
            delivery: 'aoe_self',
            reliability: 'low',
            notes: ['Hanya saat berada di air dan hanya pada gelombang terakhir; efeknya sekilas.']
          },
          {
            source: 'skill1.waves.fourth.inWaterBonus',
            effect: 'stun',
            delivery: 'aoe_self',
            reliability: 'low',
            notes: ['Hanya saat berada di air; musuh yang sangat dekat dengan Dolia terkena stun (durasi sekilas).']
          }
        ],

        mobilityProfile: {
          level: 'medium',
          uses: ['reposition'],
          notes: [
            'Skill 2 adalah dash/leap untuk reposition sekaligus menciptakan/memanfaatkan zona air.',
            'Mobilitas terbatas oleh cooldown dan positioning; Dolia bukan support dengan blink instan.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Lu Bu', compatibilityPct: 7.4 },
            { externalName: 'Shangguang', compatibilityPct: 4.53 },
            { externalName: 'Haya', compatibilityPct: 3.49 },
            { externalName: "Ao'yin", compatibilityPct: 2.76 },
            { externalName: 'Liu Bei', compatibilityPct: 2.07 },
            { externalName: 'Fatih', compatibilityPct: 2.06 },
            { externalName: 'Heino', compatibilityPct: 2.03 },
            { externalName: 'Umbrosa', compatibilityPct: 1.4 },
            { externalName: 'Garuda', compatibilityPct: 1.23 }
          ],
          trio: [
            { externalNames: ['Gao', 'Lu Bu'], compatibilityPct: 11.74 },
            { externalNames: ['Lu Bu', 'Yixing'], compatibilityPct: 11.5 },
            { externalNames: ['Lu Bu', 'Shangguang'], compatibilityPct: 8.68 },
            { externalNames: ['Garuda', 'Lu Bu'], compatibilityPct: 8.35 },
            { externalNames: ['Di Renjie', 'Shangguang'], compatibilityPct: 8.0 },
            { externalNames: ['Yang Jian', 'Haya'], compatibilityPct: 7.72 },
            { externalNames: ['Haya', 'Flowborn (Marksman)'], compatibilityPct: 7.59 },
            { externalNames: ['Lu Bu', 'Marco Polo'], compatibilityPct: 7.17 },
            { externalNames: ["Ao'yin", 'Jing'], compatibilityPct: 6.01 },
            { externalNames: ['Lu Bu', "Ao'yin"], compatibilityPct: 5.94 },
            { externalNames: ['Liu Bei', 'Shangguang'], compatibilityPct: 5.08 },
            { externalNames: ['Shangguang', 'Umbrosa'], compatibilityPct: 4.35 },
            { externalNames: ["Ao'yin", 'Umbrosa'], compatibilityPct: 4.01 },
            { externalNames: ['Garuda', 'Allain'], compatibilityPct: 3.77 },
            { externalNames: ['Kaizer', 'Heino'], compatibilityPct: 3.63 },
            { externalNames: ['Musashi', 'Heino'], compatibilityPct: 3.48 },
            { externalNames: ['Fatih', 'Marco Polo'], compatibilityPct: 3.17 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh core dengan skill cooldown panjang/impact besar untuk dimaksimalkan oleh reset CD Ultimate.',
            'Tim yang nyaman fight di area (kolam/air) agar sustain + CC situasional bisa dimaksimalkan.',
            'Butuh proteksi/spacing; Dolia bukan frontline dan mudah dihukum oleh dive.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Dive/burst ke backline yang memaksa Dolia mati sebelum sempat mereset skill core.',
            'Fight dipaksa jauh dari zona air/kolam sehingga nilai sustain + CC situasional menurun.',
            'Disengage/zone control musuh yang mengusir tim dari kolam.'
          ],
          notes: [
            'Ultimate bersifat targeted dan ada channel singkat; tekanan pada Dolia sering memutus timing reset.'
          ]
        },

        needsValidation: {
          questions: []
        }
      }
    },
    {
      id: 'ying',
      name: 'Ying',
      role: 'Jungling',
      secondaryRoles: [],

      tags: ['fighter', 'assassin', 'engage', 'initiate', 'versatile', 'mid_game', 'physical', 'melee', 'jungling', 'mobility', 'dash', 'cc', 'slow', 'cc_immunity', 'damage_reduction', 'displacement', 'multi_hit', 'magic'],

      image: 'images/heroes/ying.png',

      profile: {
        type: 'Fighter/Assassin',
        subtype: 'Assassin Fighter',
        uniqueness: ['Mendekati', 'Fleksibel'],
        power: 'Mid Game',
        lane: 'Jungling'
      },

      skills: {
        passive: {
          name: 'Spear Will — Sweeping Fire',
          categories: ['enhance', 'cooldown_cut', 'physical', 'crit', 'sustain', 'shield'],
          rawDescription: 'Skill Pasif: Spear Will - Sweeping Fire (Tingkatkan, Cooldown)\nYing memiliki hubungan batin dengan tombaknya. Menggunakan Skill aktif akan memberikan 1 tumpukan Spear Will selama 5 Detik.\nSpear Will meningkatkan Serangan Dasar berikutnya, yang mengonsumsi semua tumpukan Spear Will yang ada dan melancarkan Skill Spear Will lain tergantung jumlah tumpukannya.\n1 tumpukan: Stalwart - Peacemaker\n2 tumpukan: Zealous - Devastation\n3 tumpukan: Zenith - Wildfire\nMenggunakan Skill Spear Will akan mempersingkat CD Skill 1 dan 2 sebanyak 1,5 Detik.\n(Spear Will Skill bisa menimbulkan Critical Damage dan waktu yang dibutuhkan untuk menyelesaikannya dipengaruhi oleh 15% dari Kecepatan Serangannya.)',
          mechanics: {
            spearWill: {
              stacks: {
                max: 3,
                durationSec: 5,
                refreshOnGain: true,
                gainedFrom: ['skill1', 'skill2', 'skill3']
              },
              consumesAllStacksOnNextBasicAttack: true,
              canCrit: true,
              executionTimeScaling: {
                affectedByAttackSpeedPct: 15
              },
              cooldownRefund: {
                targets: ['skill1', 'skill2'],
                cdReductionSec: 1.5,
                triggersOn: 'spearWillSkillCast'
              },
              variantsByStacks: {
                one: {
                  name: 'Stalwart — Peacemaker',
                  cdSec: 1,
                  categories: ['shield', 'physical', 'enhance', 'multi_hit'],
                  hits: {
                    count: 4,
                    damagePerHit: { physical: { baseDamage: 60, bonusPhysicalAttackPct: 45 } }
                  },
                  shield: {
                    value: { base: 100, bonusPhysicalAttackPct: 60 },
                    durationSec: 2
                  },
                  moveSpeedBonusPct: 10,
                  moveSpeedDurationSec: 1
                },
                two: {
                  name: 'Zealous — Devastation',
                  cdSec: 1,
                  categories: ['recovery', 'physical', 'enhance', 'multi_hit'],
                  hits: {
                    count: 3,
                    firstTwo: {
                      damage: { physical: { baseDamage: 100, bonusPhysicalAttackPct: 45 } },
                      heal: { flat: 65, bonusHpPct: 1 }
                    },
                    third: {
                      damage: { physical: { baseDamage: 200, bonusPhysicalAttackPct: 80 } },
                      heal: { flat: 130, bonusHpPct: 2 }
                    }
                  },
                  missingHpScaling: {
                    maxIncreasePct: 200,
                    notes: ['Efek recovery per serangan meningkat sesuai HP yang hilang (maks +200%).']
                  }
                },
                three: {
                  name: 'Zenith — Wildfire',
                  cdSec: 1,
                  categories: ['physical', 'enhance', 'mobility', 'execute'],
                  leapAndSlam: {
                    applies: true,
                    damage: {
                      min: { physical: { baseDamage: 100, bonusPhysicalAttackPct: 26 } },
                      max: { physical: { baseDamage: 300, bonusPhysicalAttackPct: 80 } },
                      maxWhenTargetHpBelowPct: 50,
                      notes: ['Perlu validasi: scaling damage (linear vs threshold) saat target <50% HP.']
                    },
                    movement: {
                      canMoveWhileExecuting: true,
                      canPassTerrain: true
                    },
                    buffs: {
                      moveSpeedBonusPct: 200,
                      damageReductionPct: 10
                    }
                  }
                }
              }
            }
          }
        },

        skill1: {
          name: 'Moonslash',
          cdSec: 9,
          manaCost: 45,
          categories: ['cc', 'physical'],
          rawDescription: 'Skill 1: Moonslash (CC, Damage Fisik) (CD 9 Detik) Konsumsi Mana 45\nYing mengayunkan tombaknya ke atas, lalu menghantamkannya ke tanah, membuat musuh terkena Launch selama 0,5 Detik. Kedua serangan menimbulkan 225 (225 + 65% Serangan Fisik ekstra) Damage Fisik.',
          mechanics: {
            delivery: 'two_hit_slam',
            hits: {
              count: 2,
              damagePerHit: { physical: { baseDamage: 225, bonusPhysicalAttackPct: 65 } }
            },
            crowdControl: {
              effect: 'launch',
              durationSec: 0.5,
              notes: ['Launch diasumsikan terjadi pada hit ke-2 (slam ke tanah).']
            }
          }
        },

        skill2: {
          name: 'Cloudchaser',
          cdSec: 10,
          manaCost: 40,
          categories: ['movement', 'dash', 'speed_up', 'physical', 'slow'],
          rawDescription: 'Skill 2: Cloudchaser (Gerakan, Gerak Cepat, Damage Fisik) (CD 10 Detik) Konsumsi Mana 40\nYing mengangkat tongkatnya dan mengumpulkan tenaga, meningkatkan Kecepatan Gerakannya hingga 25% secara bertahap. Setelah tenaganya terkumpul, Dash ke depan sambil menyabet musuh, menimbulkan 166 (80 + 50% Serangan Fisik) - 333 (160 + 100% Serangan Fisik) Damage Fisik dan 15% Slow selama 1 Detik. (Jarak Dash dan Damage yang ditimbulkan bertambah sesuai durasi pengumpulan tenaga).',
          mechanics: {
            delivery: 'charged_dash',
            charge: {
              canReleaseAnytime: true,
              moveSpeedBonusPctUpTo: 25,
              ramps: 'gradual',
              affects: ['dashDistance', 'damage'],
              notes: ['Bonus MS hanya selama charge. Durasi maksimum charge belum dicatat.']
            },
            dash: {
              direction: 'forward',
              distanceScalesWithCharge: true
            },
            damage: {
              min: { physical: { baseDamage: 80, bonusPhysicalAttackPct: 50 } },
              max: { physical: { baseDamage: 160, bonusPhysicalAttackPct: 100 } },
              notes: ['Damage meningkat sesuai durasi charge.']
            },
            crowdControl: {
              effect: 'slow',
              slowPct: 15,
              durationSec: 1
            }
          }
        },

        skill3: {
          name: 'Starburn',
          cdSec: 40,
          manaCost: 90,
          categories: ['dash', 'cc', 'cc_immunity', 'damage_reduction', 'physical', 'magic', 'displacement', 'multi_hit', 'zone'],
          rawDescription: 'Skill 3: Starburn (Dash, CC, Kekebalan) (CD 40 Detik) Konsumsi Mana 90\nYing membakar ujung Sweeping Fire dan melakukan Dash ke arah target, menimbulkan 165 (70 + 55% Serangan Fisik) Damage Fisik pada musuh yang terhantam dan membuat musuh di sekitar terkena efek Launch.\nDi akhir Dash, dia menyerang 4 kali dengan Sweeping Fire, masing-masing menimbulkan 82 (35 + 27% Serangan Fisik) Damage Fisik. Kemudian, dia Dash kembali ke titik awalnya, menimbulkan 165 (70 + 55% Serangan Fisik) Damage Fisik pada musuh yang terhantam dan menyeret mereka. Saat menggunakkan Skill ini, dia mendapatkan kekebalan Crowd Control dan 10% reduksi Damage, serta membuat musuh yang terhantam terkena efek Launch.\nSkill ini dapat digunakan lagi setelah dia kembali ke titik awal untuk menebas area berbentuk kerucut, menimbulkan 165 (70 + 55% Serangan Fisik) Damage Fisik dan meninggalkan jejak api selama 3 Detik. Jejak api itu menimbulkan 47 (30 + 10% Serangan Fisik) Damage Magis pada musuh dalam jangkauan setiap 0,2 Detik.\nSecara alternatif, dia bisa langsung menggunakan Skill ini lagi setelah Dash pertama, di mana dia tidak akan melakukan Dash ke dua, tapi akan menebas area sekelilingnya untuk menimbulkan 120 (60 + 35% Serangan Fisik) Damage Fisik dan menciptakan Zona lingkaran api yang aktif selama 3 Detik',
          mechanics: {
            selfBuffs: {
              ccImmunity: true,
              damageReductionPct: 10
            },
            crowdControl: {
              effect: 'launch',
              durationSec: 1,
              notes: ['Durasi Launch total ~1 detik (dari cast Dash pertama sampai Dash balik selesai).']
            },
            stages: {
              dashIn: {
                delivery: 'dash_targeted',
                damage: { physical: { baseDamage: 70, bonusPhysicalAttackPct: 55 } },
                launchArea: {
                  shape: 'along_path',
                  notes: ['Area Launch mencakup lintasan dari titik Dash 1 hingga Dash balik. Radius belum dicatat.']
                }
              },
              endFlurry: {
                hits: {
                  count: 4,
                  damagePerHit: { physical: { baseDamage: 35, bonusPhysicalAttackPct: 27 } }
                }
              },
              returnDash: {
                delivery: 'dash_return',
                damage: { physical: { baseDamage: 70, bonusPhysicalAttackPct: 55 } },
                displacement: {
                  type: 'drag_to_midpoint',
                  notes: ['Target yang terhantam diseret ke titik tengah antara lokasi awal dan lokasi akhir Dash pertama.']
                }
              }
            },
            recast: {
              afterReturn: {
                delivery: 'cone',
                cone: { angleDeg: 75, range: 'medium' },
                damage: { physical: { baseDamage: 70, bonusPhysicalAttackPct: 55 } },
                fireTrail: {
                  durationSec: 3,
                  tickIntervalSec: 0.2,
                  damagePerTick: { magic: { baseDamage: 30, bonusPhysicalAttackPct: 10 } }
                }
              },
              afterFirstDashAlternative: {
                delivery: 'aoe_self',
                damage: { physical: { baseDamage: 60, bonusPhysicalAttackPct: 35 } },
                fireZone: {
                  shape: 'circle',
                  durationSec: 3,
                  damage: {
                    tickIntervalSec: null,
                    damagePerTick: null,
                    notes: ['Damage tick zona api lingkaran belum dicatat.']
                  }
                },
                notes: ['Recast ini digunakan langsung setelah Dash pertama dan membatalkan Dash balik.']
              }
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 183, base: 183, bonus: 0 },
          maxHP: 3394,
          maxMana: 580,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 380,
          hpRegenPer5s: 49,
          manaRegenPer5s: 14,
          attackRange: 'Melee'
        },

        level15: {
          physicalAttack: { total: 359, base: 359, bonus: 0 },
          maxHP: 6947,
          maxMana: 1160,
          physicalDefense: { value: 395 },
          magicDefense: { value: 166 },
          attackSpeedBonusPct: 33,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 380,
          hpRegenPer5s: 89,
          manaRegenPer5s: 28,
          attackRange: 'Melee'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Fighter/Assassin',
          playPattern: 'Flexible diver: bisa war opener (S3 dash masuk ke kerumunan + launch + CC immunity) atau pick tool (S3 recast alternatif untuk isolate target lalu keluar). Stack Spear Will lewat skill → empowered basic untuk burst/execute. Pasif 3 stack (Zenith-Wildfire) memberi escape lewat terrain saat perlu keluar.',
          engageRole: 'primary',
          notes: [
            'Berbeda dari flanker murni — Ying bisa masuk ke kerumunan karena CC immunity + damage reduction S3, bukan hanya mencari target terisolasi.',
            'Dua pola S3: (1) full combo masuk-return untuk war opener, (2) recast langsung setelah dash pertama untuk pick + fire zone tanpa return.',
            'Tempo utama: masuk dengan CC singkat, keluarkan burst multi-hit Spear Will, lalu gunakan dash/return atau Zenith-Wildfire untuk reset posisi.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'high',
          late: 'medium',
          notes: [
            'Mid game kuat karena akses engage/CC immunity dari Ultimate dan burst dari Spear Will.',
            'Late game tetap relevan sebagai pick tool, tetapi lebih rentan jika musuh punya peel/chain CC.'
          ]
        },

        draftValues: {
          mobility: 'high',
          frontline: 'low',
          sustain: 'medium',

          engage: 'high',
          disengage: 'medium',
          peel: 'low',

          cc: 'medium',
          pickPotential: 'high',

          burst: 'high',
          dps: 'medium'
        },

        crowdControl: [
          {
            source: 'skill1',
            effect: 'launch',
            delivery: 'aoe_self',
            reliability: 'high',
            durationSec: 0.5,
            notes: ['Launch singkat untuk setup combo/interrupt.']
          },
          {
            source: 'skill2',
            effect: 'slow',
            delivery: 'targeted_dash',
            reliability: 'medium',
            durationSec: 1,
            notes: ['Slow 15% setelah dash; damage & jarak dash bergantung charge.']
          },
          {
            source: 'skill3',
            effect: 'launch',
            delivery: 'targeted_dash',
            reliability: 'medium',
            durationSec: 1,
            notes: [
              'Launch terjadi selama rangkaian Starburn (dash masuk → return dash).',
              'Area launch mencakup lintasan dash masuk sampai dash balik (radius belum dicatat).'
            ]
          },
          {
            source: 'skill3.returnDash',
            effect: 'knockback',
            delivery: 'targeted_dash',
            reliability: 'medium',
            countsAsCrowdControl: false,
            notes: ['Ada displacement: target yang kena diseret ke titik tengah antara start dan end dash pertama.']
          }
        ],

        mobilityProfile: {
          level: 'high',
          uses: ['engage', 'chase', 'reposition'],
          notes: [
            'Mobilitas tinggi, terutama saat Ultimate tersedia (dash masuk + return).',
            'Skill 2 memberi opsi gapclose/keluar, tetapi performa bergantung charge timing.'
          ],
          sources: [
            {
              source: 'skill2',
              type: 'dash',
              delivery: 'targeted_dash',
              reliability: 'medium',
              notes: ['Charged dash; bisa dilepas kapan saja (jarak skala dengan charge).']
            },
            {
              source: 'skill3',
              type: 'in_out_dash',
              delivery: 'targeted_dash',
              reliability: 'high',
              notes: ['Dash masuk lalu return dash memberi opsi commit atau reset posisi.']
            },
            {
              source: 'passive.spearWill.variantsByStacks.three',
              type: 'gapclose',
              delivery: 'self_buff',
              reliability: 'medium',
              notes: ['Zenith — Wildfire punya komponen leap dan bisa melewati terrain (data mentah).']
            }
          ]
        },

        needsValidation: {
          questions: []
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Cai Yan', compatibilityPct: 1.62 },
            { externalName: 'Yaria', compatibilityPct: 1.60 },
            { externalName: 'Nezha', compatibilityPct: 1.53 }
          ],
          trio: [
            { externalNames: ['Marco Polo', 'Yaria'], compatibilityPct: 18.69 },
            { externalNames: ['Sun Bin', 'Dr Bian'], compatibilityPct: 4.06 }
          ]
        },

        teamNeeds: {
          needs: [
            'Frontline/peel dari tim agar Ying bisa masuk tanpa langsung dihentikan.',
            'Follow-up damage/CC untuk mengonversi Launch menjadi pick atau kill.',
            'Vision/control area untuk memilih angle dash yang aman (khususnya saat Ultimate off cooldown).'
          ]
        },

        counterplay: {
          counteredBy: [
            'Peel kuat + chain hard CC setelah window CC immunity dari Ultimate habis.',
            'Kiting/disengage yang memaksa Ying commit dash tanpa hasil.',
            'Burst cepat saat Ying masuk (sebelum sustain/shield dari Spear Will memberi value).'
          ],
          notes: ['Walau Starburn memberi CC immunity + damage reduction, Ying tetap rentan jika timing masuk buruk atau tanpa follow-up.']
        }
      },

      coachNotes: {
        summary: 'Jungler fighter/assassin dengan engage dash dan burst multi-hit berbasis stack. Kuat untuk pick dan skirmish mid game.',
        draftStrengths: ['Engage cepat (dash + launch)', 'Punya window CC immunity saat Ultimate', 'Potensi pick tinggi dan bisa reset posisi'],
        draftRisks: ['Bukan tank: butuh frontline/vision', 'Jika masuk sendirian mudah dipunish setelah immunity habis', 'Sebagian detail damage zona alternatif belum tervalidasi']
      }
    },
    {
      id: 'dun',
      name: 'Dun',
      role: 'Clash Lane',
      secondaryRoles: ['Jungling', 'Roaming'],

      tags: ['tank', 'fighter', 'guardian', 'frontline', 'cc', 'engage', 'initiate', 'versatile', 'early_game', 'physical', 'melee', 'sustain', 'recovery', 'heal', 'basic_attack_amp', 'shield', 'true_damage', 'cooldown_cut', 'cc_immunity'],

      image: 'images/heroes/dun.png',

      profile: {
        traits: ['CC', 'Versatile'],
        type: 'Tank/Fighter',
        subtype: 'Guardian Tank',
        uniqueness: ['Mendekati', 'CC'],
        power: 'Early Game',
        lane: 'Clash Lane',
        sub: 'Jungler, Roaming'
      },

      skills: {
        passive: {
          name: 'Unyielding Might',
          categories: ['recovery', 'sustain', 'enhance', 'conditional'],
          rawDescription: 'Skill Pasif: Unyielding Might (Recovery)\nSaat HP Dun di bawah 50%, menerima Damage membuatnya ditingkatkan selama 8 Detik, menyebabkan Serangan Dasar dari Skillnya memulihkan 220 (220+6% HP ekstra) HP. Efek Pasif ini hanya bisa terpicu setiap 25 Detik (Berkurang sesuai Level Hero)',
          mechanics: {
            trigger: {
              whenHpBelowPct: 50,
              on: 'take_damage',
              internalCooldownSec: 25,
              internalCooldownReducesWithLevel: true,
              notes: ['Nilai pengurangan cooldown pasif per level belum dicatat.']
            },
            buff: {
              durationSec: 8,
              notes: ['Selama buff aktif, basic attack yang termasuk dalam rangkaian skill Dun memulihkan HP.']
            },
            healing: {
              onEnhancedBasicAttack: {
                hp: { flat: 220, bonusHpPct: 6 },
                notes: ['Scaling menggunakan HP ekstra (bonus HP).']
              }
            }
          }
        },

        skill1: {
          name: 'Wind Slash',
          cdSec: 8,
          manaCost: 40,
          categories: ['cc', 'physical', 'slow'],
          rawDescription: 'Skill 1: Wind Slash (CC, Damage Fisik, Slow) (CD 8 Detik) Konsumsi Mana 40\nDun mengayunkan pedangnya dan menciptakan tebasan udara ke arah target, menimbulkan 420 (420+130% Serangan Fisik ekstra) Damage Fisik dan 25% Slow selama 2 Detik pada musuh dalam jangkauan. Jika tebasan menghantam musuh, dia bisa menggunakan Skill ini lagi dalam 5 Detik, menimbulkan 420 (420+130% Serangan Fisik ekstra) Damage Fisik dan Launch selama 1 Detik.',
          mechanics: {
            delivery: 'skillshot_line',
            line: {
              range: 'medium',
              passesThroughUnits: true,
              notes: ['Tebasan berbentuk garis (bukan proyektil terbang); hit pada unit apa pun membuka recast.']
            },
            stages: {
              initial: {
                damage: { physical: { baseDamage: 420, bonusPhysicalAttackPct: 130 } },
                crowdControl: {
                  effect: 'slow',
                  slowPct: 25,
                  durationSec: 2
                }
              },
              recast: {
                windowSec: 5,
                availableIfHitUnit: true,
                direction: 'free_aim',
                damage: { physical: { baseDamage: 420, bonusPhysicalAttackPct: 130 } },
                crowdControl: {
                  effect: 'launch',
                  durationSec: 1
                }
              }
            }
          }
        },

        skill2: {
          name: "Gale's Benediction",
          cdSec: 7,
          manaCost: 35,
          categories: ['shield', 'magic', 'enhance', 'true_damage', 'cooldown_cut'],
          rawDescription: "Skill 2: Gale's Benediction (Shield, Damage Magis, Tingkatkan) (CD 7 Detik) Konsumsi Mana 35\nDun menimbulkan 250 (250+80% Serangan Fisik ekstra) Damage Magis pada musuh di sekitar dan mendapatkan Shield yang menangkal Damage sebesar 500 (500+12% HP ekstra) selama 5 Detik. 3 Serangan Dasar berikutnya dalam rentang 8 Detik ditingkatkan, masing-masing menimbulkan 130 (130+40% Serangan Fisik ekstra) True Damage tambahan. Menghantam musuh akan mempersingkat CD Ultimate selama 1 Detik.",
          mechanics: {
            delivery: 'aoe_self',
            damage: {
              magic: { baseDamage: 250, bonusPhysicalAttackPct: 80 }
            },
            shield: {
              amount: { flat: 500, bonusHpPct: 12 },
              durationSec: 5
            },
            enhanceBasicAttacks: {
              charges: 3,
              windowSec: 8,
              bonusTrueDamage: { baseDamage: 130, bonusPhysicalAttackPct: 40 },
              ultimateCooldownReductionOnHitSec: 1,
              countsNonHeroes: true,
              notes: ['Pengurangan CD Ultimate hanya berlaku untuk 3 enhanced basic attack (termasuk hit ke minion/monster).']
            }
          }
        },

        skill3: {
          name: 'Unruly Blade',
          cdSec: 16,
          manaCost: 50,
          categories: ['movement', 'cc', 'physical', 'engage', 'initiate', 'cc_immunity'],
          rawDescription: 'Skill 3: Unruly Blade (Gerakan, CC, Damage Fisik) (CD 16 Detik) Konsumsi Mana 50\nDun melemparkan pedang berantainya ke arah target yang berhenti saat menghantam musuh atau mencapai jangkauan maksimumnya. Pedangnya mengakibatkan Stun selama 1 Detik pada musuh pertama yang terhantam. Dun menimbulkan 420 (420+10% HP ekstra) Damage Fisik pada musuh di sekitar pedangnya dan menarik dirinya ke lokasi pedangnya. Setelah tiba, dia menimbulkan 420 (420+10% HP ekstra) Damage Fisik lagi pada musuh di sekitarnya. Selama menggunakan Skill ini, Dun mendapatkan Kekebalan CC.',
          mechanics: {
            delivery: 'skillshot_line',
            tetherBlade: {
              stopsOnFirstUnitHit: true,
              stopsAtMaxRange: true,
              pullsSelfToBladeLocation: true,
              notes: ['Walau tidak mengenai musuh, Dun tetap tertarik ke lokasi pedang saat pedang berhenti di jarak maksimum.']
            },
            crowdControl: {
              effect: 'stun',
              durationSec: 1,
              target: 'first_unit_hit'
            },
            ccImmunity: {
              applies: true,
              duration: 'until_land',
              notes: ['Kekebalan CC aktif sampai skill selesai / Dun mendarat.']
            },
            damage: {
              prePullAoe: { physical: { baseDamage: 420, bonusHpPct: 10 } },
              onArrivalAoe: { physical: { baseDamage: 420, bonusHpPct: 10 } }
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 193, base: 183, bonus: 10 },
          maxHP: 3590,
          maxMana: 600,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 0,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 380,
          hpRegenPer5s: 84,
          manaRegenPer5s: 15,
          attackRange: 'Melee'
        },

        level15: {
          physicalAttack: { total: 334, base: 324, bonus: 10 },
          maxHP: 7865,
          maxMana: 1200,
          physicalDefense: { value: 416 },
          magicDefense: { value: 195 },
          attackSpeedBonusPct: 14,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 380,
          hpRegenPer5s: 192,
          manaRegenPer5s: 30,
          attackRange: 'Melee'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Tank/Fighter',
          engageRole: 'primary',
          playPattern: 'Guardian frontliner: buka fight dengan chain blade, lalu sustain lewat shield + heal threshold.',
          notes: [
            'Ult (Unruly Blade) adalah tombol engage utama: stun target pertama + tarik diri ke titik pedang, ditutup AoE damage kedua.',
            'Skill 2 memberi shield 5 detik + 3 enhanced basic attack true damage (juga memotong CD ult), membuat Dun kuat untuk skirmish early.',
            'Pasif aktif saat HP < 50% dan menerima damage: memberi window sustain 8 detik untuk bertahan saat commit.'
          ]
        },

        powerCurve: {
          early: 'high',
          mid: 'medium',
          late: 'medium',
          notes: [
            'Early game kuat untuk memaksa skirmish: engage + CC + shield dan pasif sustain saat HP rendah.',
            'Nilai mid-late lebih banyak sebagai frontliner/peel dan setup pick; bukan carry damage.'
          ]
        },

        draftValues: {
          mobility: 'medium',
          frontline: 'high',
          sustain: 'high',

          engage: 'high',
          disengage: 'low',
          peel: 'medium',

          cc: 'high',
          pickPotential: 'high',

          burst: 'medium',
          dps: 'low'
        },

        crowdControl: [
          {
            source: 'skill1.initial',
            effect: 'slow',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 2,
            notes: ['Slow 25% dari tebasan garis (tembus unit) membantu setup recast/engage.']
          },
          {
            source: 'skill1.recast',
            effect: 'launch',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 1,
            notes: ['Recast terbuka jika cast pertama mengenai unit apa pun; arah bebas.']
          },
          {
            source: 'skill3',
            effect: 'stun',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 1,
            notes: ['Stun mengenai unit pertama yang kena; Dun tetap gapclose walau tidak ada hit.']
          }
        ],

        mobilityProfile: {
          level: 'medium',
          uses: ['engage', 'reposition'],
          notes: ['Mobilitas utama datang dari gapclose Ultimate (tarik diri ke titik pedang).'],
          sources: [
            {
              source: 'skill3',
              type: 'gapclose',
              delivery: 'skillshot_line',
              reliability: 'medium',
              notes: ['Selalu menarik Dun ke titik pedang (hit atau tidak).']
            }
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: ['Nilai adalah kompatibilitas resmi HoK (bukan win rate/pick rate). Disarankan dipakai sebagai bonus kecil/tie-breaker setelah kebutuhan komposisi terpenuhi.']
          },
          duo: [
            { externalName: 'Ziya', compatibilityPct: 2.68 },
            { externalName: 'Ming', compatibilityPct: 1.97 },
            { externalName: 'Milady', compatibilityPct: 1.67 },
            { externalName: 'Garuda', compatibilityPct: 1.42 }
          ],
          trio: [
            { externalNames: ['Hou Yi', 'Ming'], compatibilityPct: 9.66 },
            { externalNames: ['Kongming', 'Ming'], compatibilityPct: 7.59 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh follow-up damage dari backline untuk mengonversi engage (stun/launch) menjadi kill/objektif.',
            'Butuh vision/tempo agar skillshot engage tidak mudah di-dodge.',
            'Jika tim sudah punya initiator lain, Dun bisa lebih fokus sebagai frontline + peel sekunder.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Kiting/disengage yang memaksa ult engage whiff lalu punish saat Dun sudah commit.',
            'Peel kuat pada target utama sehingga chain engage tidak menghasilkan kill.',
            'Anti-sustain/grievous wounds (mengurangi value pasif heal) dan burst setelah shield habis.'
          ]
        },

        needsValidation: {
          questions: []
        }
      }
    },
    {
      id: 'angela',
      name: 'Angela',
      role: 'Mid Lane',
      secondaryRoles: [],

      tags: ['mage', 'artillery', 'burst', 'anti_tank', 'magic', 'ranged', 'shield'],

      image: 'images/heroes/angela.png',

      profile: {
        type: 'Mage',
        subtype: 'Artillery Mage',
        uniqueness: ['Burst', 'Shield'],
        power: 'Seimbang (Early, Mid, Late Game)',
        lane: 'Mid Lane'
      },

      skills: {
        passive: {
          name: 'Flame Incantation',
          categories: ['magic', 'damage_amp', 'move_speed', 'stacking'],
          rawDescription: 'Skill Pasif: Flame Incantation (Damage Magis, Gerak Cepat)\nSetiap kali Skill Aktif Angela menimbulkan Damage, Skill tersebut memberikan 1 tumpukan Burning pada target dan memberikan 1 tumpukan peningkatan Kecepatan Gerakan pada dirinya sendiri selama 3 Detik, hingga 10 tumpukan per efek.\nSetiap tumpukan Burning pada target menimbulkan 10 (10 + 2% Serangan Magis) Damage Magis tambahan pada target tersebut dari Skill Aktifnya, sedangkan setiap tumpukan pada Angela meningkatkan Kecepatan Gerakannya sebesar 2%',
          mechanics: {
            trigger: {
              on: 'active_skill_damage',
              perTarget: true,
              countsDamageOverTimeTicks: true,
              notes: ['AoE yang mengenai beberapa target memberi stack terpisah per target (contoh: kena 3 musuh = 3 stack MS).']
            },
            burning: {
              maxStacks: 10,
              durationSec: 3,
              durationModel: 'shared_timer_per_target',
              durationRefreshesOnApply: true,
              bonusMagicDamagePerStack: { flat: 10, bonusMagicAttackPct: 2 },
              appliedTo: 'damaged_target',
              appliesToMultipleTargets: true,
              bonusDamageUsesPreApplyStacks: true
            },
            selfMoveSpeed: {
              maxStacks: 10,
              durationSec: 3,
              durationModel: 'independent_timers',
              moveSpeedPerStackPct: 2
            }
          }
        },

        skill1: {
          name: 'Scorching Barrage',
          cdSec: 5,
          manaCost: 40,
          categories: ['magic', 'damage', 'poke', 'multi_hit'],
          rawDescription: 'Skill 1: Scorching Barrage (Damage Magis) (CD 5 Detik) Konsumsi Mana: 40\nAngela menembakkan 5 Bola api ke arah target. Saat satu bola api menghantam Hero musuh, bola api tersebut akan lenyap dan menimbulkan 270 (270 + 30% Serangan Magis) Damage Magis. Bola api akan menimbulkan jumlah Damage yang sama pada unit Non-Hero yang terhantam.\n(Saat beberapa bola api menghantam target yang sama, hantaman bola api setelah yang pertama hanya menimbulkan 30% Damage).',
          mechanics: {
            delivery: 'skillshot_multi_projectile',
            projectiles: {
              count: 5,
              firing: 'simultaneous',
              piercesNonHeroes: true,
              stopsOnHeroHit: true,
              notes: ['Proyektil menembus minion/monster; berhenti saat menghantam hero musuh.']
            },
            damage: {
              magicPerProjectile: { baseDamage: 270, bonusMagicAttackPct: 30 },
              multiHitSameTarget: { subsequentHitMultiplier: 0.3 }
            }
          }
        },

        skill2: {
          name: 'Chaos Cinder',
          cdSec: 10,
          manaCost: 60,
          categories: ['cc', 'slow', 'magic', 'damage', 'zone', 'dot'],
          rawDescription: 'Skill 2: Chaos Cinder (CC, Slow, Damage Magis) (CD 10 Detik) Konsumsi Mana: 60\nAngela menembakkan bola api ke arah target yang membentuk pusaran api saat menghantam musuh atau saat mencapai jangkauan maksimumnya, menimbulkan Stun selama 1 Detik pada musuh yang pertama terhantam.\nPusaran api ini menimbulkan 125 (125 + 20% Serangan Magis) Damage Magis pada musuh di sekitarnya setiap 0,5 Detik dan Slow sebesar 30% selama 1,5 Detik.',
          mechanics: {
            delivery: 'skillshot_projectile',
            projectile: {
              blocksOnNonHero: true,
              blocksOnHero: true,
              createsZoneOnHit: true,
              createsZoneOnMaxRange: true,
              notes: ['Jika mengenai minion/monster, projectile berhenti dan vortex langsung muncul.']
            },
            crowdControl: {
              onFirstHit: {
                effect: 'stun',
                durationSec: 1,
                appliesTo: 'first_unit_hit'
              }
            },
            zone: {
              type: 'vortex_fire',
              durationSec: 2,
              tickIntervalSec: 0.5,
              tickStart: 'unknown',
              effects: {
                damage: {
                  magicPerTick: { baseDamage: 125, bonusMagicAttackPct: 20 }
                },
                slow: {
                  slowPct: 30,
                  durationSec: 1.5,
                  refreshesOnTick: true
                }
              }
            },
            notes: ['Tidak ada impact damage; damage hanya dari tick vortex.']
          }
        },

        skill3: {
          name: 'Blazing Brilliance',
          cdSec: 25,
          manaCost: 90,
          categories: ['magic', 'damage', 'channel', 'beam', 'multi_hit', 'shield', 'cc_immunity'],
          rawDescription: 'Skill 3: Blazing Brilliance (Damage, Kekebalan, Shield) (CD 25 Detik) Konsumsi Mana: 90\nAngela menembakkan laser ke arah yang ditentukan, menghasilkan hingga 12 hantaman serangan sebesar 150 (150 + 21% Serangan Magis) Damage Magis pada musuh yang terhantam. Angela dapat membelokkan arah laser selama menembakkannya.\nSelama laser ditembakkan, Angela mendapatkan Shield yang memberikan kekebalan CC dan menangkal 850 (850 + 88% Serangan Magis) Damage.\nGunakan Skill ini lagi setelah 0,5 Detik untuk berhenti menembakkan laser.',
          mechanics: {
            delivery: 'channel_beam',
            channel: {
              durationSec: 4,
              canMove: false,
              canRotateBeam: true,
              recastCancel: {
                availableAfterSec: 0.5,
                effect: 'stop_channel'
              },
              interruptedBy: {
                condition: 'hard_cc_when_cc_immunity_off',
                notes: ['Channel terhenti jika terkena hard CC setelah shield pecah (CC immunity tidak aktif).']
              }
            },
            beam: {
              pierces: true,
              hitsMultipleUnitsPerTick: true,
              hitsNonHeroes: true,
              maxHits: 12,
              estimatedHitIntervalSec: 0.33,
              notes: ['Damage diberikan per tick pada semua unit yang berada di garis laser.']
            },
            damage: {
              magicPerHit: { baseDamage: 150, bonusMagicAttackPct: 21 }
            },
            selfShield: {
              absorb: { base: 850, bonusMagicAttackPct: 88 },
              grantsCCImmunityWhileActive: true
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 172, base: 172, bonus: 0 },
          magicAttack: { total: 10, base: 10, bonus: 0 },
          maxHP: 3328,
          maxMana: 640,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 47,
          manaRegenPer5s: 16,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 303, base: 303, bonus: 0 },
          magicAttack: { total: 10, base: 10, bonus: 0 },
          maxHP: 6070,
          maxMana: 1280,
          physicalDefense: { value: 360 },
          magicDefense: { value: 229 },
          attackSpeedBonusPct: 26,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 76,
          manaRegenPer5s: 32,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Mage',
          engageRole: 'secondary',
          playPattern: 'Poke → Burst picker + zone control: spam S1 (CD 5 detik, 5 proyektil) dari jarak aman untuk stack Burning pasif (maks 10 stack = amplify damage signifikan), lalu punish dengan S2 stun + S3 channel beam saat target tidak bisa keluar. Bukan engager — tidak punya dash, S3 membuat Angela rooted.',
          notes: [
            'Pick pattern: stack Burning lewat S1 poke → S2 stun/vortex slow → S3 beam untuk maximize damage window.',
            'S3 situasional: shield CC immunity bisa dipecah burst, setelah itu channel bisa di-interrupt hard CC.',
            'S2 sering ketahan minion/monster saat wave ramai — butuh positioning yang bersih untuk stun connect.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'high',
          late: 'high',
          notes: [
            'Mid/Late makin kuat karena pasif stacking + DoT S2 + beam multi-hit S3 lebih mudah dimaksimalkan di teamfight/objektif.'
          ]
        },

        draftValues: {
          mobility: 'medium',
          frontline: 'low',
          sustain: 'low',

          engage: 'low',
          disengage: 'medium',
          peel: 'low',

          cc: 'medium',
          pickPotential: 'high',

          burst: 'high',
          dps: 'medium'
        },

        crowdControl: [
          {
            source: 'skill2',
            effect: 'stun',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 1,
            notes: ['Stun hanya pada unit pertama yang terkena; sering ketahan minion/monster saat wave ramai.']
          },
          {
            source: 'skill2',
            effect: 'slow',
            delivery: 'aoe_ground',
            reliability: 'high',
            durationSec: 1.5,
            notes: ['Slow 30% di-refresh tiap tick vortex (0,5 detik) selama musuh berada di area.']
          }
        ],

        mobilityProfile: {
          level: 'medium',
          uses: ['chase', 'reposition'],
          notes: ['Tanpa dash/blink, tetapi pasif memberi MS stacking cepat saat skill/DoT mengenai banyak target.']
        },

        teamNeeds: {
          needs: [
            'Butuh frontline/peel agar Angela bisa channel S3 dengan aman (Angela rooted saat beam).',
            'Butuh setup/vision dan control agar skillshot (S1/S2) lebih konsisten connect.',
            'Butuh follow-up lockdown dari tim supaya musuh tidak mudah keluar dari vortex S2 atau garis beam S3.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: ['Nilai adalah kompatibilitas resmi HoK (bukan win rate/pick rate). Disarankan dipakai sebagai bonus kecil/tie-breaker setelah kebutuhan komposisi terpenuhi.']
          },
          duo: [
            { externalName: 'Kui', compatibilityPct: 2.27 },
            { externalName: 'Mi Yue', compatibilityPct: 1.88 },
            { externalName: 'Gao Changgong', compatibilityPct: 1.38 }
          ],
          trio: [
            { externalNames: ['Mi Yue', 'Kui'], compatibilityPct: 5.46 },
            { externalNames: ['Consort Yu', 'Kui'], compatibilityPct: 4.15 },
            { externalNames: ['Luban', 'Kui'], compatibilityPct: 4.05 },
            { externalNames: ['Wukong', 'Kui'], compatibilityPct: 3.88 }
          ]
        },

        counterplay: {
          counteredBy: [
            'Burst untuk memecahkan shield S3 lalu hard CC untuk menghentikan channel (CC immunity hanya saat shield aktif).',
            'Gunakan minion/monster sebagai body-block untuk menahan stun S2.',
            'Disengage/keluar garis beam atau flank ke Angela saat ia rooted selama S3.'
          ]
        },

        needsValidation: {
          questions: []
        }
      }
    },
    {
      id: 'marco_polo',
      name: 'Marco Polo',
      role: 'Farm Lane',
      secondaryRoles: [],

      tags: ['marksman', 'nimble', 'poke', 'anti_tank', 'physical', 'ranged'],

      image: 'images/heroes/marcopolo.png',

      profile: {
        type: 'Marksman',
        subtype: 'Nimble Marksman',
        uniqueness: ['Ranged Poke'],
        power: 'Seimbang (Early, Mid, Late Game)',
        lane: 'Farm Lane'
      },

      skills: {
        passive: {
          name: 'Chain Reaction',
          categories: ['true_damage', 'mark', 'stacking', 'energy_restore', 'anti_tank'],
          rawDescription: 'Skill Pasif: Chain Reaction (True Damage, Mark)\nSetiap kali Marco Polo menimbulkan Damage pada Serangan Dasar atau Skill, dia menempatkan 1 tumpukan Destruction pada target (5 tumpukan pada Minion). Saat mencapai 10 tumpukan, tumpukan ini berubah menjadi Destroyed Defense selama 5 Detik, sedangkan dirinya memulihkan 30 Energi.\nSerangan Dasar dan Skillnya menimbulkan 100 (100/200+35% Serangan Fisik ekstra) True Damage tambahan pada musuh dengan Destroyed Defense.',
          mechanics: {
            destruction: {
              maxStacks: 10,
              durationSec: 5,
              durationRefreshesOnApply: true,
              stacksPerDamageInstance: {
                hero: 1,
                nonHero: 1,
                minion: 5
              },
              gainedBy: ['basic', 'skill_damage'],
              countsPerInstanceDamage: true,
              transformsAtMaxStacks: true
            },
            destroyedDefense: {
              durationSec: 5,
              blocksFurtherDestructionStacksWhileActive: true,
              onApply: {
                selfEnergyRestore: 30
              }
            },
            bonusTrueDamage: {
              appliesTo: ['basic', 'skill_damage'],
              condition: 'target_has_destroyed_defense',
              perInstance: true,
              trueDamage: {
                baseDamageByLevel: { level1: 100, level15: 200 },
                bonusPhysicalAttackPct: 35
              },
              notes: ['Selama Destroyed Defense aktif: setiap instance damage dari basic/skill memicu true damage tambahan.']
            }
          }
        },

        skill1: {
          name: 'Resplendent Revolver',
          cdSec: 5,
          manaCost: 75,
          categories: ['physical', 'damage', 'multi_hit', 'poke', 'movement', 'move_speed_buff', 'energy_restore'],
          rawDescription: 'Skill 1: Resplendent Revolver (Damage Fisik, Gerak Cepat) (CD 5 Detik) Konsumsi Energi 75/69/63/57/51/45\nMarco Polo menembakkan 5/6/7/8/9/10 peluru ke arah target yang (Kecepatan menembaknya di pengaruhi oleh Kecepatan Serangan). Selama menembak, dia mendapatkan 10% Kecepatan Gerakan. Setiap peluru menimbulkan 151 (120/144/168/192/216/240+18% Serangan Fisik) Damage Fisik pada musuh pertama yang terhantam dan memulihkan Marco Polo 10 Energi.\nSetiap 3 tembakkan peluru dihitung sebagai 1 Serangan Dasar.',
          mechanics: {
            delivery: 'skillshot_line',
            firing: {
              projectiles: {
                countBySkillLevel: [5, 6, 7, 8, 9, 10],
                hits: 'first_unit_hit',
                notes: ['Bisa ditahan minion/frontline. Dengan positioning/angle yang tepat, semua peluru bisa mengenai 1 target yang sama.']
              },
              scalesWithAttackSpeed: true,
              canMoveWhileFiring: true,
              selfBuff: {
                moveSpeedBonusPct: 10,
                duration: 'while_firing'
              }
            },
            damage: {
              physicalPerProjectile: {
                baseDamageBySkillLevel: [120, 144, 168, 192, 216, 240],
                bonusPhysicalAttackPct: 18
              }
            },
            energy: {
              costBySkillLevel: [75, 69, 63, 57, 51, 45],
              restorePerProjectileHit: 10
            },
            basicAttackCounting: {
              shotsPerBasicAttack: 3,
              countsAsBasicAttack: true,
              onHitTriggersPerBasicAttack: 1,
              notes: [
                'Setiap 3 tembakan peluru dihitung sebagai 1 Serangan Dasar.',
                'Efek on-hit item mengikuti perhitungan basic ini (proc 1x per 3 peluru).'
              ]
            }
          }
        },

        skill2: {
          name: 'Roaming Gun',
          cdSec: 5,
          manaCost: 75,
          categories: ['movement', 'enhance', 'move_speed', 'damage_amp'],
          rawDescription: 'Skill 2: Roaming Gun (Gerakan, Tingkatkan, Gerak Cepat) (CD 5 Detik) Konsumsi Energi 75/69/63/57/51/45\nMarco Polo berteleportasi ke arah target.\nPasif: Saat ada Hero musuh di dekatnya, dia mendapatkan 15/18/21/24/27/30% Kecepatan Gerakan dan menimbulkan 20% Damage tambahan.',
          mechanics: {
            delivery: 'blink_to_point',
            energy: {
              costBySkillLevel: [75, 69, 63, 57, 51, 45]
            },
            blink: {
              target: 'point',
              type: 'directional',
              canCrossThinWalls: true,
              notes: ['Bisa menembus tembok jika tembok tidak terlalu tebal (thin wall).']
            },
            passiveAura: {
              condition: 'enemy_hero_nearby',
              approximateRange: 'sekitar jangkauan S1 (lebih jauh dari basic attack)',
              selfMoveSpeedBonusPctBySkillLevel: [15, 18, 21, 24, 27, 30],
              damageDealtBonusPct: 20,
              notes: ['Belum tervalidasi apakah bonus damage ini juga mengamplify proc true damage dari pasif Chain Reaction.']
            }
          }
        },

        skill3: {
          name: 'Fevered Barrage',
          cdSec: 50,
          manaCost: 75,
          categories: ['physical', 'damage', 'multi_hit', 'movement', 'blink', 'channel', 'teamfight'],
          rawDescription: 'Skill 3: Fevered Barrage (Damage Fisik, Gerakan) (CD 50/45/40 Detik) Konsumsi Energi 75/60/45\nMarco Polo berteleportasi ke arah target, lalu bergerak perlahan ke arah yang sama sambil melancarkan (12/15/18) rentetan tembakan pada musuh di sekitarnya selama 3 Detik (Kecepatan Tembakan meningkat sesuai dengan Kecepatan Serangan). Setiap Rentetan menimbulkan 213 (170/235/300+25% Serangan Fisik) Damage Fisik.\nSetiap 3 rentetan tembakan dihitung sebagai 1 Serangan Dasar.',
          mechanics: {
            delivery: 'blink_to_point_then_channel',
            cooldownSecBySkillLevel: [50, 45, 40],
            energy: {
              costBySkillLevel: [75, 60, 45]
            },
            blink: {
              target: 'point',
              type: 'directional',
              canCrossThinWalls: true,
              notes: ['Blink awal bisa menembus tembok tipis.']
            },
            channel: {
              durationSec: 3,
              movement: {
                forcedDirection: 'same_as_cast',
                moveSpeed: 'slow',
                canChangeDirection: false
              },
              firing: {
                targeting: 'aoe_around_self',
                hits: 'all_units_in_radius',
                shotsCountBySkillLevel: [12, 15, 18],
                fireRateScalesWithAttackSpeed: true,
                notes: ['Selama unit berada di dalam radius, seharusnya terkena rentetan. Batas jumlah target belum tervalidasi.']
              },
              cancel: {
                canCancelManually: true,
                manualCancelInputs: ['movement_analog', 'skill', 'basic_attack']
              },
              interruption: {
                canBeInterruptedByHardCC: true
              },
              defensive: {
                damageReductionPct: 0,
                ccImmunity: false,
                shield: false,
                notes: ['High risk: tidak ada lapisan defensif bawaan selama channel.']
              }
            },
            damage: {
              physicalPerBarrage: { 
                baseDamageBySkillLevel: [170, 235, 300], 
                bonusPhysicalAttackPct: 25 
              }
            },
            basicAttackCounting: {
              barragesPerBasicAttack: 3,
              countsAsBasicAttack: true,
              onHitTriggersPerBasicAttack: 1,
              notes: [
                'Setiap 3 rentetan dihitung sebagai 1 Serangan Dasar.',
                'Efek on-hit item mengikuti perhitungan basic ini (proc 1x per 3 rentetan).'
              ]
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 185, base: 175, bonus: 10 },
          maxHP: 3207,
          maxMana: 200,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 10,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 46,
          manaRegenPer5s: 50,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 369, base: 359, bonus: 10 },
          maxHP: 5820,
          maxMana: 200,
          physicalDefense: { value: 339 },
          magicDefense: { value: 178 },
          attackSpeedBonusPct: 38,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 75,
          manaRegenPer5s: 50,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Marksman',
          engageRole: 'secondary',
          playPattern: 'Anti-tank nimble marksman: pecahkan 10 stack Destruction dalam 5 detik untuk mengaktifkan Destroyed Defense (5s), lalu maksimalkan multi-hit (S1/S3) untuk proc true damage per instance. Memiliki blink untuk positioning, tetapi Ultimate adalah commit high-risk tanpa defensif dan bisa dihentikan hard CC.',
          notes: [
            'Win condition utama: uptime hit instance tinggi (Attack Speed sangat penting) untuk cepat memicu Destroyed Defense dan menghabisi target tanky.',
            'S1 dan S3 dihitung sebagai basic attack untuk efek on-hit (proc 1x per 3 peluru/rentetan).',
            'S3: tidak bisa ubah arah, bergerak pelan maju; bisa cancel manual tetapi rawan di-interrupt hard CC.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'high',
          late: 'high',
          notes: [
            'Scaling sangat dipengaruhi Attack Speed karena S1/S3 meningkatkan fire rate dan memperbanyak instance untuk proc true damage.',
            'Power relatif stabil; spike meningkat saat item Attack Speed cukup untuk konsisten pecah mark di fight.'
          ]
        },

        draftValues: {
          mobility: 'high',
          frontline: 'low',
          sustain: 'low',

          engage: 'low',
          disengage: 'medium',
          peel: 'low',

          cc: 'low',
          pickPotential: 'medium',

          burst: 'medium',
          dps: 'high'
        },

        crowdControl: [],

        mobilityProfile: {
          level: 'high',
          uses: ['reposition', 'escape', 'chase'],
          notes: [
            'S2 blink directional (bisa tembus tembok tipis) memberi fleksibilitas angle untuk S1 dan keluar masuk fight.',
            'S3 memiliki blink entry namun channel-nya memaksa bergerak satu arah dan bisa dihentikan hard CC.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Yaria', compatibilityPct: 25.01 },
            { externalName: 'Lady Zhen', compatibilityPct: 2.05 },
            { externalName: 'Luna', compatibilityPct: 1.49 }
          ],
          trio: [
            { externalNames: ['Lady Zhen', 'Yaria'], compatibilityPct: 29.82 },
            { externalNames: ['Luna', 'Yaria'], compatibilityPct: 29.62 },
            { externalNames: ['Yaria', 'Lam'], compatibilityPct: 28.87 },
            { externalNames: ['Diaochan', 'Yaria'], compatibilityPct: 19.02 },
            { externalNames: ['Wang Zhaojun', 'Yaria'], compatibilityPct: 18.83 },
            { externalNames: ['Li Bai', 'Yaria'], compatibilityPct: 18.69 },
            { externalNames: ['Yaria', 'Ying'], compatibilityPct: 18.69 },
            { externalNames: ['Yaria', 'Cirrus'], compatibilityPct: 18.63 },
            { externalNames: ['Han Xin', 'Yaria'], compatibilityPct: 18.62 },
            { externalNames: ['Lu Bu', 'Dolia'], compatibilityPct: 7.17 },
            { externalNames: ['Sima Yi', 'Guiguzi'], compatibilityPct: 6.81 },
            { externalNames: ['Sun Bin', 'Sima Yi'], compatibilityPct: 4.13 },
            { externalNames: ['Fatih', 'Dolia'], compatibilityPct: 3.17 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh frontline/peel untuk menjaga Marco saat commit S3 (tidak ada shield/DR/CC immunity) dan saat memaksimalkan proc multi-hit.',
            'Butuh lockdown/zone control dari tim agar target tidak mudah keluar radius S3 dan agar peluru S1 lebih mudah connect penuh.',
            'Butuh vision/setup lane supaya positioning/angle skillshot (S1) tidak mudah dibody-block.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Hard CC untuk meng-interrupt Ultimate (S3) dan menghukum commit blink.',
            'Disengage/kiting keluar radius S3 untuk memutus multi-hit + proc true damage.',
            'Body-block (minion/frontliner) untuk mengurangi peluru S1 mengenai target utama.'
          ],
          notes: ['Marco high risk/high reward: jika channel S3 diputus atau target keluar area, value turun drastis.']
        },

        needsValidation: {
          questions: [
            'Resource Marco Polo adalah Energi. Saat ini disimpan sementara di field maxMana/manaRegenPer5s agar konsisten dengan schema stats hero lain.',
            'Validasi behavior: selama Destroyed Defense aktif, bonus true damage pasif benar-benar proc pada semua instance damage (basic + tick/multi-hit skill) tanpa pembatas tambahan.',
            'Validasi pasif S2 (enemy hero nearby): radius terasa sekitar jangkauan S1 dan lebih jauh dari basic attack; butuh angka/range pasti.',
            'Validasi apakah bonus damage pasif S2 (+20% damage dealt) juga mengamplify true damage proc dari pasif Chain Reaction.',
            'Validasi Ultimate (S3): apakah rentetan menarget semua unit dalam radius tanpa target cap; butuh angka radius/limit jika ada.'
          ]
        }
      }
    },
    {
      id: 'liu_shan',
      name: 'Liu Shan',
      role: 'Roaming',
      secondaryRoles: [],

      tags: ['tank', 'support', 'frontline', 'cc', 'control', 'push', 'objective', 'early_game', 'melee', 'tower_disrupt', 'shield', 'stun', 'launch', 'slow'],

      image: 'images/heroes/liu_shan.png',

      profile: {
        type: 'Support/Tank',
        subtype: 'Support Taktis',
        uniqueness: ['Push', 'CC'],
        power: 'Early Game',
        lane: 'Roaming'
      },

      skills: {
        passive: {
          name: 'Magnetic Barrier',
          categories: ['disrupt', 'recovery', 'push', 'objective', 'tower_interaction'],
          rawDescription: 'Skill Pasif: Magnetic Barrier (Disrupt, Recovery)\nSkill Liu Shan menimbulkan Damage setara pada Tower dan Skill CC miliknya mengakibatkan Disrupt pada mereka selama 1,2 Detik. Dia menjarah puing Tower untuk memulihkan 280 HP saat menyerang Tower dengan Skill-nya.',
          mechanics: {
            towers: {
              skillsDealFullDamage: true,
              notes: ['Skill Liu Shan menimbulkan damage setara pada Tower (tidak terkena penalti tower).']
            },
            towerDisrupt: {
              sources: ['skill1', 'skill2'],
              durationSec: 1.2,
              appliesOn: 'each_hit',
              refreshesOnApply: true,
              notes: ['Disrupt hanya berlaku pada Tower.']
            },
            towerHealOnSkillHit: {
              selfHealFlat: 280,
              appliesOn: 'each_hit'
            }
          }
        },

        skill1: {
          name: 'Overcharge!',
          cdSec: 9,
          manaCost: 50,
          categories: ['cc', 'shield', 'damage', 'mobility', 'enhanced_basic_attack'],
          rawDescription: 'Skill 1: Overcharge! (CC, Shield, Damage) (CD 9 Detik) Konsumsi Mana 50\nLiu Shan mengakibatkan Shield dan memulai serangan, mendapatkan 50% Kecepatan Gerakan dan Shield yang menangkal 650 (650+14% HP ekstra) Damage selama 3 Detik. Selain itu, Serangan Dasar Liu Shan berikutnya akan ditingkatkan (dapat disimpan hingga total 6 Detik), membuatnya melompat dan menghantam tanah, menimbulkan 350 (350+122% Serangan Fisik) Damage Fisik pada musuh dalam jangkauan dan membuat mereka terkena efek Launch selama 1 Detik.',
          mechanics: {
            selfBuff: {
              durationSec: 3,
              moveSpeedBonusPct: 50,
              moveSpeedDecaysOverTime: false,
              shield: {
                durationSec: 3,
                absorb: {
                  baseValue: 650,
                  bonusHpPct: 14
                }
              }
            },
            enhancedBasicAttack: {
              windowSec: 6,
              leap: {
                applies: true,
                notes: ['Range lompatan belum dicatat.']
              },
              aoe: {
                shape: 'circle',
                notes: ['Radius belum dicatat.']
              },
              damage: {
                physical: { baseDamage: 350, bonusPhysicalAttackPct: 122 }
              },
              crowdControl: {
                effect: 'launch',
                durationSec: 1
              },
              countsAsSkillHit: true,
              notes: ['Enhanced basic dapat disimpan 3 detik tambahan setelah buff 3 detik berakhir (total window 6 detik).']
            }
          }
        },

        skill2: {
          name: 'Robo Smash',
          cdSec: 7.5,
          manaCost: 40,
          categories: ['cc', 'damage'],
          rawDescription: 'Skill 2: Robo Smash (CC, Damage) (CD 7,5 Detik) Konsumsi Mana 40\nLiu Shan memerintahkan Mechcraft miliknya untuk mencakar musuh dalam area kerucut, menimbulkan 400 (400+100% Serangan Fisik) Damage Fisik pada mereka dan membuat mereka Stun selama 1 Detik.',
          mechanics: {
            delivery: 'skillshot_cone',
            cone: {
              angleDeg: 45,
              range: 'short',
              notes: ['Range terasa dekat (short-to-mid).']
            },
            damage: {
              physical: { baseDamage: 400, bonusPhysicalAttackPct: 100 }
            },
            crowdControl: {
              effect: 'stun',
              durationSec: 1
            },
            hitProfile: {
              isSingleHit: true
            }
          }
        },

        skill3: {
          name: 'Take It for a Spin',
          cdSec: 40,
          manaCost: 100,
          categories: ['damage', 'slow'],
          rawDescription: 'Skill 3: Take It for a Spin (Damage, Slow) (CD 40 Detik) Konsumsi Mana 100\nMechcraft Liu Shan memutar lengannya, menimbulkan 380 (380+110% Serangan Fisik ekstra) Damage Fisik setiap 0,5 Detik selama 3 Detik serta Slow sebesar 15% selama 0,5 Detik pada musuh di sekitar. Selama berputar, Skill lain tetap bisa digunakan.',
          mechanics: {
            delivery: 'aoe_self',
            durationSec: 3,
            tickIntervalSec: 0.5,
            ticksTotal: 6,
            area: {
              radius: 'short',
              notes: ['Radius terasa mirip S2 (dekat / short-to-mid).']
            },
            damagePerTick: {
              physical: { baseDamage: 380, bonusPhysicalAttackPct: 110 }
            },
            slow: {
              slowPct: 15,
              durationSec: 0.5,
              appliesEachTick: true
            },
            canCastOtherSkillsWhileActive: true,
            movementAllowed: true,
            canCancelEarly: false,
            notes: ['S3 dapat memicu heal pasif saat mengenai Tower, namun tidak memicu disrupt (disrupt hanya dari S1 & S2).']
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 180, base: 180, bonus: 0 },
          maxHP: 3659,
          maxMana: 600,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 0,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 375,
          hpRegenPer5s: 84,
          manaRegenPer5s: 15,
          attackRange: 'Melee'
        },

        level15: {
          physicalAttack: { total: 308, base: 308, bonus: 0 },
          maxHP: 8736,
          maxMana: 1200,
          physicalDefense: { value: 430 },
          magicDefense: { value: 178 },
          moveSpeedBonusPct: 21,
          attackSpeedBonusPct: 0,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 375,
          hpRegenPer5s: 214,
          manaRegenPer5s: 30,
          attackRange: 'Melee'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Tank/Support',
          playPattern: 'Roaming tank untuk early tempo: masuk posisi dengan S1 (MS+shield) lalu chain CC (S2 stun → S1 enhanced launch). Punya win condition objektif yang kuat: S1/S2 dapat disrupt Tower 1,2s dan semua skill yang mengenai Tower memulihkan 280 HP per hit. S3 memberi slow aura untuk menjaga musuh tetap dekat saat dive/siege, dan skill lain tetap bisa digunakan selama S3 aktif.',
          engageRole: 'primary',
          notes: [
            'Identitas: CC tank untuk membuka war dan mengawal tempo early game.',
            'Keunikan "push": pasif memungkinkan interaksi Tower (disrupt dari S1/S2 dan heal saat skill mengenai Tower) untuk pressure objektif.',
            'S1: buff MS+shield 3 detik, tetapi enhanced basic dapat disimpan hingga total 6 detik untuk memilih timing engage.',
            'S3: multi-tick (0,5 detik) memberi slow refresh; efektif untuk nempel dan zoning di area sempit.'
          ]
        },

        powerCurve: {
          early: 'high',
          mid: 'medium',
          late: 'medium',
          notes: [
            'Power tertinggi di early game: CC chain + MS/shield untuk forcing skirmish dan pressure tower via disrupt.',
            'Mid-late game value lebih banyak dari utilitas (stun/launch/slow) dan setup objektif; damage bukan fokus utama.'
          ]
        },

        draftValues: {
          mobility: 'medium',
          frontline: 'high',
          sustain: 'low',

          engage: 'high',
          disengage: 'medium',
          peel: 'medium',

          cc: 'high',
          pickPotential: 'medium',

          burst: 'low',
          dps: 'low'
        },

        crowdControl: [
          {
            source: 'skill1.enhancedBasicAttack',
            effect: 'launch',
            delivery: 'targeted_melee',
            reliability: 'high',
            durationSec: 1,
            notes: ['Enhanced basic AoE slam; radius belum dicatat.']
          },
          {
            source: 'skill2',
            effect: 'stun',
            delivery: 'skillshot_cone',
            reliability: 'high',
            durationSec: 1,
            notes: ['Cone 45 derajat; range dekat (short-to-mid).']
          },
          {
            source: 'skill3',
            effect: 'slow',
            delivery: 'aoe_self',
            reliability: 'high',
            durationSec: 0.5,
            notes: ['Refresh tiap tick (0,5 detik) selama durasi S3 (3 detik) jika musuh tetap di area.']
          }
        ],

        mobilityProfile: {
          level: 'medium',
          uses: ['engage', 'chase', 'reposition'],
          notes: [
            'S1 memberi +50% movement speed + shield 3 detik untuk masuk posisi dan memulai engage.',
            'Enhanced basic window total 6 detik membantu memilih timing engage tanpa harus commit langsung.',
            'Tidak punya dash/blink; engage bergantung positioning + MS buff + CC chain.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Agudo', compatibilityPct: 3.38 },
            { externalName: 'Milady', compatibilityPct: 2.5 },
            { externalName: 'Shouyue', compatibilityPct: 2.28 },
            { externalName: 'Fang', compatibilityPct: 2.23 },
            { externalName: 'Mi Yue', compatibilityPct: 2.01 },
            { externalName: 'Sima Yi', compatibilityPct: 1.67 },
            { externalName: 'Charlotte', compatibilityPct: 1.46 },
            { externalName: 'Ukyo Tachibana', compatibilityPct: 1.16 }
          ],
          trio: [
            { externalNames: ['Di Renjie', 'Butterfly'], compatibilityPct: 6.6 },
            { externalNames: ['Fang', 'Milady'], compatibilityPct: 6.52 },
            { externalNames: ['Consort Yu', 'Milady'], compatibilityPct: 5.53 },
            { externalNames: ['Luban', 'Mi Yue'], compatibilityPct: 3.99 },
            { externalNames: ['Shouyue', 'Li Xin'], compatibilityPct: 3.92 },
            { externalNames: ['Erin', 'Milady'], compatibilityPct: 3.6 },
            { externalNames: ['Shouyue', 'Charlotte'], compatibilityPct: 3.33 },
            { externalNames: ['Ukyo Tachibana', 'Milady'], compatibilityPct: 3.32 },
            { externalNames: ['Erin', 'Ukyo Tachibana'], compatibilityPct: 2.89 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh follow-up damage dari core (Mid/Farm/Jungle) setelah Liu Shan membuka fight dengan CC.',
            'Butuh waveclear/tempo lane agar disrupt Tower bisa dikonversi menjadi damage turret (tanpa wave, pressure objektif berkurang).',
            'Butuh rekan yang bisa commit saat window disrupt Tower aktif (contoh: jungler diver / follow-up cepat).',
            'Tim diuntungkan jika bisa mengkonversi CC menjadi objektif (tower/dragon) karena power spike early.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Poke/zoning jarak jauh memaksa Liu Shan sulit masuk tanpa kehilangan shield.',
            'Kiting/disengage keluar dari radius S3 untuk memutus slow refresh dan mengurangi value multi-tick.',
            'Peel/chain hard CC saat Liu Shan masuk untuk memutus follow-up (S2/S1 enhanced) dan menghukum overcommit.',
            'Punish saat engage tanpa follow-up (Liu Shan bukan sumber damage utama).'
          ]
        },

        needsValidation: {
          questions: [
            'Konfirmasi apakah "Bonus Kecepatan Gerakan 21%" pada level 15 adalah stat bawaan atau berasal dari pasif/skill.',
            'Radius aktual S1 enhanced slam (AoE) belum dicatat.',
            'Radius aktual S3 (aura putar) belum dicatat; saat ini dicatat sebagai "short" dengan note mirip S2.'
          ]
        }
      }
    },
    {
      id: 'li_xin',
      name: 'Li Xin',
      role: 'Clash Lane',
      secondaryRoles: [],

      tags: ['fighter', 'berserker', 'versatile', 'nimble', 'melee', 'physical', 'cc', 'dash', 'slow', 'recovery', 'cooldown_cut', 'attack_speed', 'cc_immunity', 'damage_reduction', 'launch', 'multi_hit', 'execute', 'stance'],

      image: 'images/heroes/li_xin.png',

      profile: {
        traits: ['Versatile', 'Nimble'],
        type: 'Fighter',
        subtype: 'Berserker',
        uniqueness: ['Mendekati', 'CC'],
        power: 'Seimbang (Early, Mid, Late Game)',
        lane: 'Clash Lane'
      },

      skills: {
        passive: {
          name: 'Ashen Razer / Void Slice / Scorched Strikes',
          categories: ['exp', 'movement_speed', 'physical', 'enhance', 'cooldown_cut', 'basic_attack_amp', 'range_up', 'pierce'],
          rawDescription: 'Skill Pasif: Ashen Razer (EXP)\nLi Xin melepaskan kekuatannya secara bertahap. Saat dalam bentuk normalnya, dia mendapatkan 10 EXP setiap kali dia menghantam Hero musuh dengan Serangan Dasarnya atau Skill 2.\n\nSkill Pasif: Void Slice (Gerak Cepat, Damage Fisik)\nLi Xin mendapatkan 30 Kecepatan Gerakan. Dia melanjutkan setiap Serangan Dasar dengan satu serangan tambahan yang menimbulkan 65 Damage Fisik.\n\nSkill Pasif: Scorched Strikes (Tingkatkan, CD, Damage Fisik)\nSetelah Li Xin menggunakan Skill, Serangan Dasar berikutnya akan ditingkatkan, menimbulkan 50% Damage Fisik tambahan sambil mendapatkan efek penembusan dan peningkatan jangkauan (bisa disimpan 5 detik). Saat dia menghantam musuh dengan Serangan Dasar Ditingkatkan atau Skill aktif, CD semua Skill aktifnya akan berkurang 1 detik.',
          mechanics: {
            forms: {
              ashenRazer: {
                activeBeforeLevel: 4,
                expOnHitToEnemyHero: {
                  expPerHit: 10,
                  triggers: ['basic_attack_hit', 'skill2_hit'],
                  persistsThroughDeath: true
                }
              },
              revenge: {
                moveSpeedBonusFlat: 30,
                followUpBasicAttack: {
                  damage: {
                    physical: { baseDamage: 65 }
                  },
                  countsAsBasicAttack: true,
                  canCrit: true,
                  appliesOnHitEffects: true,
                  validTargets: ['hero', 'minion', 'monster', 'tower'],
                  notes: ['Crit/on-hit effects tidak berlaku ke tower.']
                }
              },
              domination: {
                enhancedBasicAfterSkill: {
                  windowSec: 5,
                  bonusPhysicalDamagePct: 50,
                  piercesUnits: true,
                  rangeIncreased: true
                },
                cooldownReductionOnHit: {
                  cooldownReductionSec: 1,
                  triggers: ['enhanced_basic_hit', 'skill_active_hit'],
                  affectsSkills: ['skill1', 'skill2', 'skill3'],
                  notes: [
                    'Hit dari enhanced basic atau skill aktif mengurangi CD semua skill aktif sebesar 1 detik.',
                    'Perhitungan berdasarkan instance hit: 1 slash/proyektil yang mengenai >=1 target dihitung 1 (terverifikasi: mengenai 2 target bersamaan tetap 1).',
                    'Multi-hit skill dapat memicu beberapa kali per cast (contoh: Blade Flurry 1-4 hit).',
                    'Observasi: cooldown Skill 3 (ultimate) juga ikut berkurang, namun tidak ada animasi/petunjuk visual pengurangan cooldown.'
                  ]
                }
              }
            }
          }
        },

        skill1: {
          name: 'Lightning Dash / Righteous Fervor / Righteous Charge',
          categories: ['movement', 'dash', 'speed_up', 'cc_immunity', 'recovery', 'damage_reduction', 'physical', 'execute', 'cooldown_cut'],
          rawDescription: 'Skill 1: Lightning Dash (Gerakan) (CD 7 Detik)\nLi Xin melakukan Dash ke arah target.\n\nSkill 1: Righteous Fervor (Gerak Cepat, Kekebalan, Recovery) (CD 10 Detik)\nLi Xin mengumpulakn tenaga sambil berlari, mendapatkan Kekebalan CC dan 100 Kecepatan Gerakan, melenyapkan Efek Slow dari dirinya, dan memulihkan 65 (65+1% HP ekstra) HP setiap 0,5 Detik.\nJika dia mengumpulkan tenaga sampai penuh, dia mendapatkan 40% Kecepatan Serangan selama 3 Detik, kemudia Kecepatan Gerakan yang di dapatkan tersebut akan lenyap secara perlahan dalam rentang 2 Detik.\nSetiap kali menghantam musuh dengan Serangan Dasar, CD Skill ini dipersingkat 1 Detik.\n\nSkill 1: Righteous Charge (Gerakan, Kekebalan, Reduksi Damage) (CD 8 Detik)\nLi Xin mengisi kekuatan sambil mendapatkan 25% Reduksi Damage dan Kekebalan CC.\nDia lalu Dash ke arah target, mempertahankan efek Kekebalan CC selama Dash, dan menimbulkan 140 (50+50% Serangan Fisik)-420 (150+150% Serangan Fisik) Damage Fisik pada musuh yang terhantam tergantung pada durasinya mengisi kekuatan. Dia juga menimbulkan Damage Fisik tambahan sebesar 12% HP target yang hilang.\nJika Skill diinterupsi saat Li Xin mengisi kekuatan, CD Skill 1 akan dipersingkat 40%.',
          variants: {
            ashenRazer: {
              name: 'Lightning Dash',
              cdSec: 7,
              categories: ['movement', 'dash'],
              mechanics: {
                delivery: 'point_dash',
                notes: ['Dash ke arah input/cursor (point dash).']
              }
            },

            revenge: {
              name: 'Righteous Fervor',
              cdSec: 10,
              categories: ['movement', 'speed_up', 'recovery', 'cc_immunity'],
              mechanics: {
                delivery: 'self_buff',
                ccImmunity: true,
                cleanse: {
                  removes: ['slow']
                },
                moveSpeedBuff: {
                  moveSpeedBonusFlat: 100
                },
                healingOverTime: {
                  tickIntervalSec: 0.5,
                  perTick: {
                    flat: 65,
                    bonusHpPct: 1
                  }
                },
                fullChargeBonus: {
                  attackSpeedBonusPct: 40,
                  durationSec: 3,
                  moveSpeedDecayDurationSec: 2
                },
                cooldownReductionOnBasicHit: {
                  cooldownReductionSec: 1
                },
                needsValidation: {
                  questions: ['Durasi charge (waktu untuk mencapai full charge) belum dicatat.']
                }
              }
            },

            domination: {
              name: 'Righteous Charge',
              cdSec: 8,
              categories: ['movement', 'dash', 'cc_immunity', 'damage_reduction', 'physical', 'execute'],
              mechanics: {
                charge: {
                  grants: {
                    damageReductionPct: 25,
                    ccImmunity: true
                  },
                  notes: ['Damage meningkat sesuai durasi charge (min→max).']
                },
                dash: {
                  delivery: 'point_dash',
                  maintainsCcImmunityDuringDash: true
                },
                damage: {
                  physical: {
                    min: { baseDamage: 50, bonusPhysicalAttackPct: 50 },
                    max: { baseDamage: 150, bonusPhysicalAttackPct: 150 }
                  },
                  bonusMissingHpPct: 12
                },
                interruptedWhileCharging: {
                  cooldownReductionPct: 40
                },
                needsValidation: {
                  questions: ['Durasi charge (waktu untuk mencapai full damage) belum dicatat.']
                }
              }
            }
          }
        },

        skill2: {
          name: 'Chaos Wave / Brutal Gouge / Blade Flurry',
          categories: ['slow', 'physical', 'recovery', 'mark', 'multi_hit'],
          rawDescription: 'Skill 2: Chaos Wave (Slow, Damage Fisik) (CD 5 Detik)\nMenembakkan Sword Energy ke arah target, menimbulkan 480 (300 + 100% Serangan Fisik) Damage Fisik dan mengakibatkan 25% Slow pada musuh selama 2 Detik.\n\nSkill 2: Brutal Gouge (Slow, Recovery, Damage Fisik) (CD 6,5 Detik)\nLi Xin mengayunkan pedang dan menembakkan Sword Energy ke arah target, menimbulkan 424 (280+80% Serangan Fisik) Damage Fisik dan mengurangi Kecepatan Gerakan sebesar 50% selama 3 Detik, serta menerapkan Gouge selama 5 Detik pada musuh dalam jangkuan. Dia menimbulkan 90 Damage Fisik tambahan tiap menghantam target dengan efek Gouge menggunakan Serangan Dasar. Jika targetnya adalah Hero musuh, dia juga memulihkan 55 (55+0,8% HP ekstra) HP.\n\nSkill 2: Blade Flurry (Damage Fisik, Recovery) (CD 8 Detik)\nLi Xin melangkah sambil melancarkan Sword Energy 1-4 kali, (tergantung dari berapa lama tombol Skill inin ditahan). Setiap tembakan Sword Energy menimbulkan 370 (100+150% Serangan Fisik) Damage Fisik pada semua musuh yang terhantam. Dia memulihkan 120 (120+1,5% HP ekstra) HP untuk setiap tembakan Sword Energy yang menghantam musuh.',
          variants: {
            ashenRazer: {
              name: 'Chaos Wave',
              cdSec: 5,
              categories: ['physical', 'slow'],
              mechanics: {
                delivery: 'skillshot_line',
                damage: {
                  physical: { baseDamage: 300, bonusPhysicalAttackPct: 100 }
                },
                slow: {
                  slowPct: 25,
                  durationSec: 2
                }
              }
            },

            revenge: {
              name: 'Brutal Gouge',
              cdSec: 6.5,
              categories: ['physical', 'slow', 'recovery', 'mark'],
              mechanics: {
                delivery: 'skillshot_line',
                damage: {
                  physical: { baseDamage: 280, bonusPhysicalAttackPct: 80 }
                },
                slow: {
                  slowPct: 50,
                  durationSec: 3
                },
                debuff: {
                  name: 'gouge',
                  durationSec: 5,
                  appliesTo: 'targets_hit',
                  shape: 'line',
                  multiTarget: true
                },
                onBasicHitToDebuffedTarget: {
                  bonusDamage: {
                    physical: { flat: 90 }
                  },
                  healIfTargetIsEnemyHero: {
                    flat: 55,
                    bonusHpPct: 0.8
                  },
                  notes: ['Berlaku juga untuk follow-up hit dari form Revenge.']
                }
              }
            },

            domination: {
              name: 'Blade Flurry',
              cdSec: 8,
              categories: ['physical', 'recovery', 'multi_hit', 'reposition'],
              mechanics: {
                delivery: 'channeled_multishot',
                shots: { min: 1, max: 4 },
                canReaimBetweenShots: true,
                stepMovementEachShot: true,
                projectile: {
                  shape: 'line',
                  multiTarget: true,
                  canHitSameTargetMultipleTimes: true
                },
                damagePerShot: {
                  physical: { baseDamage: 100, bonusPhysicalAttackPct: 150 }
                },
                healPerShotHit: {
                  flat: 120,
                  bonusHpPct: 1.5
                },
                notes: [
                  'Aiming bisa diubah setiap tembakan (looping sesuai kebutuhan).',
                  'Praktik umum: tarik arah skill ke belakang saat channel untuk membuat Li Xin bergerak mundur (kiting), lalu arahkan kembali ke musuh saat tembakan berikutnya.'
                ],
                needsValidation: {
                  questions: ['Jarak step per tembakan belum dicatat.']
                }
              }
            }
          }
        },

        skill3: {
          name: 'Light Awakening / Shadow Seal / Searing Edge',
          categories: ['stance', 'cc', 'launch', 'physical', 'damage_reduction', 'cc_immunity', 'multi_hit', 'cooldown_refund'],
          rawDescription: 'Skill 3: Light Awakening (Ganti Form) (CD 30 Detik)\nKetika Li Xin mempelajari Skill 3, dia melepaskan kekuatan anomali, segera beralih ke Domination Form.\n\nSkill 3: Shadow Seal (CC, Damage Fisik) (CD 25 Detik)\nLi Xin melepaskan luapan energi, menciptakan magic circle di lokasinya. Setelah jeda singkat, dia menimbulkan 816 (600+120% Serangan Fisik) Damage Fisik pada musuh dalam jangkauan dan membuat mereka terkena Launch selama 0,75 Detik.\n\nSkill 3: Searing Edge (Damage Fisik, Kekebalan, Reduksi Damage) (CD 30 Detik)\nLi Xin mengumpulkan kekuatan, mendapatkan 25% Reduksi Damage dan Kekebalan CC selama durasi ini. Dia lalu melancarkan tiga tebasan gelombang energi sekaligus dalam area kerucut di arah target, mempertahankan Kekebalan CC selama durasi ini, dan menimbulkan 285 (150+75% Serangan Fisik)-855 (450+225% Serangan Fisik) Damage Fisik pada musuh yang terhantam (mencapai Damage maksimum setelah mengumpulkan kekuatan selama 1 Detik). (Saat beberapa tebasan gelombang energi menghantam target yang sama, tebasan berikutnya hanya menimbulkan 30% Damage) Jika mengumpulan kekuatannya diinterupsi atau selesai, CD Ultimate akan dipersingkat 40%.',
          variants: {
            ashenRazer: {
              name: 'Light Awakening',
              cdSec: 30,
              categories: ['stance'],
              mechanics: {
                delivery: 'stance_select',
                selectsForm: 'domination',
                notes: [
                  'Pada level 4, tombol S3/S4 dipakai untuk memilih form awal. S3 memilih Domination.',
                  'Setelah form dipilih, tombol ini menjadi ultimate sesuai form.'
                ]
              }
            },

            revenge: {
              name: 'Shadow Seal',
              cdSec: 25,
              categories: ['cc', 'launch', 'physical'],
              mechanics: {
                delivery: 'aoe_self_delayed',
                delaySec: 1,
                area: { shape: 'circle', centeredOn: 'self' },
                damage: {
                  physical: { baseDamage: 600, bonusPhysicalAttackPct: 120 }
                },
                crowdControl: {
                  effect: 'launch',
                  durationSec: 0.75
                },
                needsValidation: {
                  questions: ['Radius/ukuran circle Shadow Seal belum dicatat.']
                }
              }
            },

            domination: {
              name: 'Searing Edge',
              cdSec: 30,
              categories: ['physical', 'cc_immunity', 'damage_reduction', 'multi_hit', 'cooldown_refund'],
              mechanics: {
                charge: {
                  maxChargeSec: 1,
                  grants: {
                    damageReductionPct: 25,
                    ccImmunity: true
                  }
                },
                aimingLikeSkill2: true,
                slashes: {
                  count: 3,
                  simultaneous: true,
                  area: { shape: 'cone' },
                  repeatHitSameTargetDamagePct: 30
                },
                damage: {
                  physical: {
                    min: { baseDamage: 150, bonusPhysicalAttackPct: 75 },
                    max: { baseDamage: 450, bonusPhysicalAttackPct: 225 }
                  }
                },
                cooldownRefundOnEndOrInterrupt: {
                  cooldownReductionPct: 40
                },
                needsValidation: {
                  questions: [
                    'Untuk pasif Domination: apakah setiap gelombang/slash Searing Edge dihitung sebagai instance hit terpisah untuk pengurangan cooldown (maks -3 detik)?',
                    'Apakah 1 target bisa terkena 1/2/3 gelombang Searing Edge (tergantung posisi/arah cone), sehingga pengurangan cooldown bisa -1 s/d -3?',
                    'Apakah pengurangan cooldown dari hit Searing Edge berlaku juga saat mengenai minion/monster (bukan hanya hero)?'
                  ]
                }
              }
            }
          }
        },

        skill4: {
          name: 'Dark Awakening / Force Mastery / Force Break',
          categories: ['stance', 'cc_immunity'],
          rawDescription: 'Skill 4: Dark Awakening (Ganti Form) (CD 30 Detik)\nKetika Li Xin mempelajari Ultimatenya, dia melepaskan kekuatan anomali, segera beralih ke Revenge Form.\n\nSkill 4: Force Mastery (Ganti Form) (CD 0 Detik)\nLi Xin menekan amarah di dalam dirinya, beralih ke Domination Form. Dia tidak bisa diinterupsi oleh efek CC selama peralihan.\n\nSkill 4: Force Break (Ganti Form) (CD 0 Detik)\nLi Xin melepaskan amarah di dalam dirinya, beralih ke Revenge Form. Dia tidak bisa diinterupsi oleh efek CC selama peralihan.',
          variants: {
            ashenRazer: {
              name: 'Dark Awakening',
              cdSec: 30,
              categories: ['stance'],
              mechanics: {
                delivery: 'stance_select',
                selectsForm: 'revenge',
                notes: [
                  'Pada level 4, tombol S3/S4 dipakai untuk memilih form awal. S4 memilih Revenge.',
                  'Setelah form dipilih, tombol ini fokus untuk swap form. Cooldown skill lain tidak ter-reset saat swap.'
                ]
              }
            },

            revenge: {
              name: 'Force Mastery',
              cdSec: 0,
              categories: ['stance', 'cc_immunity'],
              mechanics: {
                delivery: 'stance_swap',
                switchesTo: 'domination',
                transition: { uninterruptibleByCC: true },
                notes: ['Swap form tidak mereset cooldown skill lain (cooldown tetap berjalan).']
              }
            },

            domination: {
              name: 'Force Break',
              cdSec: 0,
              categories: ['stance', 'cc_immunity'],
              mechanics: {
                delivery: 'stance_swap',
                switchesTo: 'revenge',
                transition: { uninterruptibleByCC: true },
                notes: ['Swap form tidak mereset cooldown skill lain (cooldown tetap berjalan).']
              }
            }
          }
      }
      },

      stats: {
        level1: {
          physicalAttack: { total: 190, base: 180, bonus: 10 },
          maxHP: 3512,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 375,
          hpRegenPer5s: 52,
          attackRange: 'Melee'
        },

        level15: {
          physicalAttack: { total: 380, base: 370, bonus: 10 },
          maxHP: 7353,
          physicalDefense: { value: 409 },
          magicDefense: { value: 173 },
          attackSpeedBonusPct: 19,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 375,
          hpRegenPer5s: 95,
          attackRange: 'Melee'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Fighter',
          playPattern: 'Fighter stance-swap dengan 2 form utama: Domination (tempo/kiting, multi-hit, CDR per hit) dan Revenge (duelist on-hit + setup teamfight). Dapat swap form kapan saja (CD 0) dan transisi tidak bisa diinterupsi CC; namun cooldown skill tidak ter-reset saat swap.',
          engageRole: 'secondary',
          notes: [
            'Level 4: S3/S4 dipakai untuk memilih form awal (Domination atau Revenge). Setelah itu, S3 menjadi ultimate sesuai form dan S4 fokus untuk swap form.',
            'Domination: unggul untuk zoning + tempo (enhanced basic + pengurangan cooldown per instance hit; multi-hit skill dapat memicu beberapa kali).',
            'Catatan Domination: pengurangan cooldown juga mempengaruhi Skill 3 (ultimate), hanya saja tidak ada animasi/petunjuk visual pengurangan cooldown.',
            'Revenge: unggul untuk duel sustain (Gouge + follow-up basic) dan teamfight setup via Shadow Seal (launch).'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'high',
          late: 'high',
          notes: [
            'Early terbantu Ashen Razer (gain EXP vs hero dari basic atau S2) untuk mengejar unlock form.',
            'Spike utama saat form sudah terbuka (Domination/Revenge) karena kit dan tempo fight jauh meningkat.'
          ]
        },

        draftValues: {
          mobility: 'high',
          frontline: 'medium',
          sustain: 'high',

          engage: 'medium',
          disengage: 'high',
          peel: 'medium',

          cc: 'medium',
          pickPotential: 'medium',

          burst: 'medium',
          dps: 'high'
        },

        crowdControl: [
          {
            source: 'skill2',
            effect: 'slow',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 2,
            notes: ['Chaos Wave: slow 25% selama 2 detik.']
          },
          {
            source: 'skill2',
            effect: 'slow',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 3,
            notes: ['Brutal Gouge (Revenge): slow 50% selama 3 detik.']
          },
          {
            source: 'skill3',
            effect: 'launch',
            delivery: 'aoe_self',
            reliability: 'medium',
            durationSec: 0.75,
            notes: ['Shadow Seal (Revenge): AoE circle di sekitar Li Xin dengan delay ~1 detik.']
          }
        ],

        mobilityProfile: {
          level: 'high',
          uses: ['engage', 'chase', 'reposition'],
          notes: [
            'Pre-lvl 4: Lightning Dash adalah point dash.',
            'Revenge: Righteous Fervor memberi sprint + cleanse slow + CC immunity (komit fight atau disengage).',
            'Domination: Righteous Charge adalah charge+dash dengan CC immunity + damage reduction.',
            'Blade Flurry (Domination) memungkinkan re-aim per tembakan dan bisa dipakai kiting (step kecil per tembakan).',
            'Swap form (Force Mastery/Force Break) CD 0 dan transisi tidak bisa diinterupsi CC; cooldown skill lain tidak ter-reset.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Kui', compatibilityPct: 2.0 },
            { externalName: 'Zhang Fei', compatibilityPct: 1.83 }
          ],
          trio: [
            { externalNames: ['Wukong', 'Kui'], compatibilityPct: 4.33 },
            { externalNames: ['Kui', 'Shouyue'], compatibilityPct: 4.18 },
            { externalNames: ['Liu Shan', 'Shouyue'], compatibilityPct: 3.92 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh sumber magic damage agar komposisi tidak terlalu full physical.',
            'Butuh follow-up damage/CC saat Shadow Seal (launch) mengenai banyak target.',
            'Butuh kontrol area/slow tambahan agar Shadow Seal (delay) lebih konsisten kena.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Kiting/zone yang konsisten sehingga Li Xin sulit menempel dan memaksimalkan tempo CDR per hit.',
            'Anti-heal + burst untuk memotong value sustain (Revenge) dan heal multi-hit (Domination).',
            'Disiplin dodge dan spacing vs Shadow Seal (delay ~1 detik) dan cone Searing Edge.'
          ]
        },

        needsValidation: {
          questions: [
            'Radius/ukuran circle Shadow Seal belum dicatat.',
            'Validasi Blade Flurry: apakah setiap tembakan yang mengenai >=1 target selalu mengurangi cooldown 1 detik (maks 4 per cast; tidak dikali jumlah target yang terkena bersamaan).',
            'Validasi Searing Edge: apakah setiap gelombang (maks 3) yang mengenai >=1 target mengurangi cooldown 1 detik, dan apakah 1 target bisa terkena 1/2/3 gelombang tergantung posisi.'
          ]
        }
      }
    },
    {
      id: 'dyadia',
      name: 'Dyadia',
      role: 'Roaming',
      secondaryRoles: [],

      tags: ['support', 'buff', 'heal', 'recovery', 'nimble', 'mobility', 'ranged', 'magic', 'cc', 'knockback', 'dash', 'reposition', 'gold', 'vision', 'mark', 'slow', 'root', 'damage_reduction', 'multi_hit'],


      image: 'images/heroes/dyadia.png',

      profile: {
        traits: ['Heal', 'Nimble'],
        type: 'Support/Mage',
        subtype: 'Support Buff',
        uniqueness: ['Buff Tim', 'Recovery'],
        power: 'Seimbang (Early, Mid, Late Game)',
        lane: 'Roaming'
      },

      skills: {
        passive: {
          name: 'Melodic Swing',
          categories: ['movement', 'cc', 'gold', 'enhance', 'magic', 'knockback', 'dash', 'reposition', 'cooldown_acceleration'],
          rawDescription: 'Skill Pasif: Melodic Swing (Gerakan, CC, Gold)\nDyadia meningkatkan Serangan Dasar berikutnya tiap 7,5-6 Detik (berkurang sesuai Level Hero): Dia berayun ke arah musuh, menimbulkan 379 (210 + 100% Serangan Fisik + 30% Serangan Magis) Damage Magis dan membuat mereka terpukul mundur, lalu menggunakan momentum tersebut untuk lompat ke belakang.\nSaat rekan tim menerima Blessing of Fate (tidak terpicu saat HP penuh, Gold berkurang setengahnya jika Skill ditujukan pada rekan satu tim dengan HP lebih dari 50%), atau hero musuh terkena Bitter Reconcilation, dia mendapatkan 20 Gold tambahan dan Cooldown Serangan Dasar Ditingkatkan miliknya dipersingkat 50%',
          mechanics: {
            enhancedBasicAttack: {
              cooldownSec: { max: 7.5, min: 6, scalesWithLevel: true },
              dashIn: {
                delivery: 'targeted_dash',
                notes: ['Klik target seperti basic attack; Dyadia auto dash mendekati target.']
              },
              damage: {
                magic: {
                  baseDamage: 210,
                  bonusPhysicalAttackPct: 100,
                  bonusMagicAttackPct: 30
                },
                notes: ['Angka 379 adalah contoh total dari formula (bergantung stat).']
              },
              crowdControl: {
                effect: 'knockback',
                distance: 'short',
                interruptsChanneling: 'unknown'
              },
              afterHitReposition: {
                type: 'back_leap',
                defaultDirection: 'away_from_target',
                steerable: true,
                notes: [
                  'Default menjauh dari target, tetapi vektor bisa sedikit diarahkan.',
                  'Jika joystick ditarik ke belakang, bisa hampir kembali ke posisi awal; jika ke samping, geser sedikit.'
                ]
              }
            },

            procAccelerator: {
              triggers: ['ally_receives_blessing_of_fate', 'enemy_hit_by_bitter_reconcilation'],
              bonusGold: {
                base: 20,
                halfIfAllyHpAbovePct: 50,
                notTriggeredIfAllyHpFull: true
              },
              cooldownReductionOnTriggerPct: 50,
              notes: ['Terasa seperti memotong sisa cooldown (progress bar bisa langsung penuh tergantung sisa).']
            }
          }
        },

        skill1: {
          name: 'Heartlink',
          cdSec: 12.5,
          manaCost: 50,
          categories: ['heal', 'movement', 'speed_up', 'dash', 'recast', 'support_buff'],
          rawDescription: 'Skill 1: Heartlink (Heal, Gerak Cepat, Gerakan)(CD: 12,5 Detik) Konsumsi Mana 50\nDyadia memberikan Fated Bond ke satu rekan tim, memulihkan 200 (200+30% Serangan Magis) HP. Selama 5 Detik berikutnya, para Hero yang menerima Fated Bond mendapatkan 30% Kecepatan Gerakan ketika bergerak mendekati satu sama lain. Ketika mereka berdekatan, Blessing of Fate akan terpicu, memulihkan 400 (400+60% Serangan Magis) HP pada keduanya dan mempertahankan Peningkatan Kecepatan Gerakan dari efek di atas selama 2 Detik.\nJika dia menggunakan Skill ini lagi ke rekan tim yang sudah memiliki Fated Bond, dia akan Dash menuju mereka dan langsung memicu Blessing of Fate. Rekan tim tersebut memulihkan 400 (400+60% Serangan Magis) HP dan mendapatkan 30% Kecepatan Gerakan selama 2 Detik, sedangkan Dyadia memulihkan 400 (400+60% Serangan Magis+8% HP ekstra) HP miliknya sendiri.\nSkill ini bisa digunakan lagi dalam 5 Detik. Jika tidak digunakan lagi, Cooldownnya akan direset.',
          mechanics: {
            delivery: 'targeted_ally',
            maxBondedAllies: 2,
            pairingRules: {
              notes: [
                'Mode Dyadia↔Ally: cast ke-2 ke ally yang sama akan dash (jika dalam range) dan trigger Blessing langsung.',
                'Mode Ally↔Ally: cast ke-2 ke ally berbeda akan membuat kedua ally menjadi pasangan Blessing (Dyadia tidak ikut).'
              ]
            },






            initialCast: {
              applies: 'fated_bond',
              heal: { flat: 200, bonusMagicAttackPct: 30 },
              bondDurationSec: 5,
              recastWindowSec: 5,
              cooldownResetsIfNotUsed: true,
              notes: ['Jika tidak ada cast ke-2 dalam window, skill tidak masuk cooldown.']
            },

            bondMoveSpeed: {
              moveTowardEachOtherBonusPct: 30,
              durationSec: 5,
              notes: ['Bonus move speed aktif ketika dua ally yang sama-sama punya Fated Bond bergerak saling mendekat.']
            },

            blessingOfFate: {
              trigger: 'when_bonded_heroes_are_close',
              consumesBond: true,
              healBoth: { flat: 400, bonusMagicAttackPct: 60 },
              moveSpeedBonusPct: 30,
              moveSpeedDurationSec: 2,
              healDoesNotApplyIfTargetHpFull: true,
              notes: ['Saat target HP penuh, heal tidak masuk tetapi move speed tetap aktif.']
            },

            recast: {
              windowSec: 5,
              condition: 'target_has_fated_bond',
              dashToAlly: true,
              requiresInDashRange: true,
              onOutOfRange: 'no_recast',
              triggersBlessingImmediately: true,
              consumesBond: true,
              healAlly: { flat: 400, bonusMagicAttackPct: 60 },
              allyMoveSpeedBonusPct: 30,
              allyMoveSpeedDurationSec: 2,
              dyadiaMoveSpeedBonusPct: 30,
              dyadiaMoveSpeedDurationSec: 2,
              selfHeal: { flat: 400, bonusMagicAttackPct: 60, bonusMaxHpPct: 8 },
              notes: [
                'Mode Dyadia↔Ally (A→A): jika target dalam range, Dyadia dash dan Blessing langsung aktif.',
                'Jika target di luar range dash, cast ke-2 dianggap tidak terjadi (hanya cast pertama yang aktif).'
              ]
            },

            secondCastToDifferentAlly: {
              windowSec: 5,
              condition: 'target_is_different_ally',
              dashToAlly: false,
              dyadiaReceivesBlessing: false,
              cast2Heal: { flat: 200, bonusMagicAttackPct: 30 },
              notes: [
                'Mode Ally↔Ally (A→B): cast ke-2 ke ally berbeda memasang Fated Bond + heal awal pada ally kedua.',
                'Blessing of Fate akan trigger saat kedua ally bonded berdekatan; Dyadia tidak ikut.'
              ]
            }
          }
        },

        skill2: {
          name: 'Bitter Farewell',
          cdSec: 12.5,
          manaCost: 50,
          categories: ['movement', 'cc', 'magic', 'mark', 'vision', 'slow', 'root', 'damage_reduction', 'gold', 'multi_hit', 'recast'],
          rawDescription: 'Skill 2: Bitter Farewell (Damage Magis, CC, Gerakan)(CD 12,5 Detik) Konsumsi Mana: 50\nDyadia menerapkan Mark Bitter Bond pada musuh, memperlihatkan lokasi musuh, dan menimbulkan 45 (45+6% Serangan Magis) Damage Magis serta mengurangi 2 Gold musuh tersebut (tak berlaku untuk Unit Non-Hero) setiap Detik selama 5 Detik. Saat efeknya berakhir, Skill ini menimbulkan 225 (225+30% Serangan Magis) Damage Magis tambahan. Saat dua musuh dengan Bitter Bond saling mendekat, Kecepatan Gerakan mereka berkurang 25%. Saat mereka berdekatan, Bitter Reconcilation akan terpicu, menghentikan Damage dari efek di atas serta mengembalikan Gold yang dikurangi.\nJika dia menggunakan Skill ini lagi pada musuh yang sudah memiliki Bitter Bond, dia akan Dash ke lokasinya, memicu Bitter Reconcilation, mengakibatkan Immobilize selama 0,75 Detik dan menimbulkan total 600 (600+80% Serangan Magis) Damage Magis. Selama rentang waktu ini, Damage yang diterimanya berkurang 25% (efek ini menjadi dua kali lipat terhadap target yang terpengaruhi)\nGold musuh yang dikurangi akan disimpan oleh Dyadia. Jika targetnya melakukan Kill atau Assist saat mengalahkan dia, 100%/50% Gold musuh tersebut akan dikembalikan.\nDia bisa menggunakan Skill ini lagi dalam 5 Detik. Jika tidak digunakan lagi, Cooldownnya akan direset',
          mechanics: {
            delivery: 'targeted',
            validTargets: ['hero', 'minion', 'monster', 'objective'],
            excludedTargets: ['tower'],

            initialCast: {
              applies: 'bitter_bond',
              durationSec: 5,
              revealsTarget: true,
              recastWindowSec: 5,
              cooldownResetsIfNotUsed: true
            },

            damageOverTime: {
              tickIntervalSec: 1,
              durationSec: 5,
              ticks: 5,
              damagePerTick: { magic: { baseDamage: 45, bonusMagicAttackPct: 6 } },
              goldDrainPerTick: {
                gold: 2,
                appliesTo: ['hero'],
                minTargetGold: 0,
                storedBy: 'dyadia'
              }
            },

            endDamageIfNotInterrupted: {
              triggersOn: 'mark_expire',
              damage: { magic: { baseDamage: 225, bonusMagicAttackPct: 30 } }
            },

            heroPairing: {
              appliesTo: ['hero'],
              maxMarkedHeroes: 2,
              slowWhenApproachingPct: 25,
              triggerReconciliationWhenClose: true,
              onReconciliation: {
                stopsDamageOverTime: true,
                cancelsEndDamage: true,
                returnsGoldDrained: true
              },
              notes: [
                'Efek pairing (slow + reconciliation) hanya berlaku jika dua target yang sama-sama punya mark adalah hero.',
                'Batas 2 target ini adalah limit aplikasi dari Skill 2 (semacam 2 stack). Ultimate Skill 3 dapat memasang Bitter Bond ke lebih dari 2 target.'
              ]
            },

            recast: {
              windowSec: 5,
              condition: 'target_has_bitter_bond',
              dashRange: 'same_as_skill1',
              dashToTarget: true,
              triggersReconciliation: true,
              stopsDamageOverTime: true,
              cancelsEndDamage: true,
              returnsGoldDrained: false,

              crowdControl: {
                effect: 'root',
                durationSec: 0.75
              },

              damage: {
                magic: { baseDamage: 600, bonusMagicAttackPct: 80 },
                hits: {
                  count: 3,
                  perHitBreakdown: 'unknown',
                  canCancelManually: true,
                  cancelStopsFurtherHits: true,
                  notes: ['Jika dicancel setelah hit ke-1/2, hit berikutnya tidak keluar (damage parsial).']
                }
              },

              damageReduction: {
                durationSec: 0.75,
                vsAllSourcesPct: 25,
                vsMarkedTargetPct: 50
              },

              storedGoldRefundOnDeath: {
                ifTargetGetsKillOnDyadiaPct: 100,
                ifTargetGetsAssistOnDyadiaPct: 50
              }
            }
          }
        },

        skill3: {
          name: 'Destined Encounter',
          cdSec: 45,
          manaCost: 100,
          categories: ['magic', 'heal', 'damage', 'mark', 'cc', 'root', 'skillshot_line', 'multi_target'],
          rawDescription: 'Skill 3: Destined Encounter (Damage Magis, Heal)(CD 45 Detik) Konsumsi Mana: 100\nDyadia mengendalikan kawanan wisp untuk terbang ke depan, memberikan Fate Bond pada rekan tim yang dilewatinya, memulihkan 250 (250+40% Serangan Magis) HP, serta menerapkan Bitter Bond pada musuh yang dilewatinya, menimbulkan 320 (320+45% Serangan Magis) Damage Magis\nJika rekan tim sudah memiliki Fate Bond, durasi efeknya akan direset, mereka juga mendapatkan pemulihan 150 (150+25% Serangan Magis) HP tambahan, serta mendapatkan 30% Kecepatan Gerakan selama 2 Detik.\nJika musuh sudah memiliki Bitter Bond, durasi efeknya akan direset. Mereka juga akan terkena 200 (200+30% Serangan Magis) tambahan, serta terkena efek Immobilize selama 1 Detik.\nPasif: Tiap kali Dyadia mendapatkan 1 Gold ekstra dari penggunaan Skill, pemulihan HP dasar dan Damage Magis yang ditimbulkan dari Destined Encounter bertambah 1.',
          mechanics: {
            delivery: 'skillshot_line',
            piercesUnits: true,
            range: 'unknown',

            alliesHit: {
              applies: 'fated_bond',
              baseHeal: { flat: 250, bonusMagicAttackPct: 40 },
              canApplyToMultipleAllies: true,
              ifTargetAlreadyHasFatedBond: {
                refreshDuration: true,
                extraHeal: { flat: 150, bonusMagicAttackPct: 25 },
                moveSpeedBonusPct: 30,
                moveSpeedDurationSec: 2
              },
              notes: [
                'Fate/Fated Bond sama dengan Skill 1 (Heartlink).',
                'Blessing of Fate bukan pasangan fixed: trigger saat dua hero yang sama-sama punya bond saling berdekatan.'
              ]
            },

            enemiesHit: {
              applies: 'bitter_bond',
              baseDamage: { magic: { baseDamage: 320, bonusMagicAttackPct: 45 } },
              canApplyToMultipleTargets: true,
              ifTargetAlreadyHasBitterBond: {
                refreshDuration: true,
                extraDamage: { magic: { baseDamage: 200, bonusMagicAttackPct: 30 } },
                crowdControl: { effect: 'root', durationSec: 1 }
              },
              notes: [
                'Bitter Bond sama dengan Skill 2 (Bitter Farewell) dan akan menjalankan DoT + gold drain + reveal seperti mark Skill 2.'
              ]
            },

            passiveScalingFromBonusGold: {
              perNetBonusGold: {
                addsToBaseHealFlat: 1,
                addsToBaseDamageFlat: 1
              },
              decreasesOnGoldRefund: true,
              notes: [
                'Menghitung net bonus gold dari penggunaan skill (trigger pasif dan gold drain).',
                'Jika gold dikembalikan (refund), stack berkurang sesuai jumlah gold yang dikembalikan.'
              ]
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 169, base: 169, bonus: 0 },
          magicAttack: { total: 10, base: 0, bonus: 10 },
          maxHP: 3332,
          maxMana: 620,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 365,
          hpRegenPer5s: 45,
          manaRegenPer5s: 15,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 310, base: 310, bonus: 0 },
          magicAttack: { total: 10, base: 0, bonus: 10 },
          maxHP: 6582,
          maxMana: 1124,
          physicalDefense: { value: 389 },
          magicDefense: { value: 212 },
          attackSpeedBonusPct: 19,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 365,
          hpRegenPer5s: 83,
          manaRegenPer5s: 30,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Support',
          playPattern:
            'Roaming enchanter/tempo: pasang bond (Fated/Bitter) untuk menang trade lewat heal + speed-up, lalu cari pick lewat mark → recast dash-root. Ultimate adalah wave skillshot line (pierce) yang mass-apply bond dan bisa setup multi-trigger Blessing.',
          engageRole: 'secondary',
          notes: [
            'Fated Bond bukan pasangan fixed: konsepnya node/peri; Blessing of Fate trigger saat dua hero yang sama-sama punya Fated Bond berdekatan.',
            'Skill 2 dibatasi 2 target aplikasi (2 stack), tapi Ultimate bisa memasang Bitter Bond ke banyak target sekaligus.',
            'Ada scaling ekonomi: net bonus gold memperkuat base heal dan base damage Ultimate.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'high',
          late: 'high',
          notes: [
            'Early cukup kuat untuk rotate/trade karena sustain + speed-up + peel ringan (knockback).',
            'Mid-late makin bernilai karena tempo teamfight (mass-bond + Blessing trigger) dan scaling dari net bonus gold.'
          ]
        },

        draftValues: {
          mobility: 'medium',
          frontline: 'low',
          sustain: 'high',

          engage: 'low',
          disengage: 'high',
          peel: 'high',

          cc: 'medium',
          pickPotential: 'medium',

          burst: 'low',
          dps: 'low'
        },

        crowdControl: [
          {
            source: 'passive',
            effect: 'knockback',
            delivery: 'targeted_dash',
            reliability: 'medium',
            notes: ['Enhanced basic attack: targeted dash → knockback jarak pendek.']
          },
          {
            source: 'skill2.recast',
            effect: 'root',
            delivery: 'targeted_dash',
            reliability: 'high',
            durationSec: 0.75,
            notes: ['Butuh target sudah punya Bitter Bond.']
          },
          {
            source: 'skill3.enemiesHit.ifTargetAlreadyHasBitterBond',
            effect: 'root',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 1,
            notes: ['Root hanya jika target sudah punya Bitter Bond sebelum terkena wave.']
          }
        ],

        mobilityProfile: {
          level: 'medium',
          uses: ['reposition', 'escape', 'chase'],
          notes: [
            'Targeted dash (S1 recast ke ally / S2 recast ke musuh) memberi opsi commit/escape jarak pendek.',
            'Pasif punya dash-in + back-leap (sedikit steerable) untuk spacing/disengage.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Arli', compatibilityPct: 2.56 },
            { externalName: "Ao'yin", compatibilityPct: 2.05 },
            { externalName: 'Yixing', compatibilityPct: 1.94 },
            { externalName: 'Feyd', compatibilityPct: 1.81 }
          ],
          trio: [
            { externalNames: ['Luna', "Ao'yin"], compatibilityPct: 5.32 },
            { externalNames: ['Lady Sun', 'Musashi'], compatibilityPct: 5.01 },
            { externalNames: ['Yixing', 'Feyd'], compatibilityPct: 3.6 },
            { externalNames: ['Yuan Ge', 'Pei'], compatibilityPct: 3.57 }
          ]
        },

        teamNeeds: {
          needs: [
            'Core yang nyaman main grouped/front-to-back untuk memaksimalkan trigger Blessing of Fate.',
            'Follow-up damage saat Dyadia berhasil root target (pick window singkat).',
            'Peel/proteksi agar Dyadia tidak dihapus duluan sebelum sustain loop dan bond setup berjalan.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Spread/spacing (hindari cluster yang memudahkan Blessing dan hindari proximity yang mengaktifkan slow pairing Bitter).',
            'Burst + hard engage ke Dyadia saat opsi dash tidak tersedia (atau saat sudah commit dash).',
            'Anti-heal untuk mengurangi value Heartlink/Blessing.'
          ]
        },

        needsValidation: {
          questions: [
            'Validasi Skill 3 (Destined Encounter): range wave (max distance) belum dicatat.',
            'Validasi pasif Skill 3: apakah +1 per net bonus gold hanya menambah base heal/damage (250/320) atau juga mempengaruhi bonus (150/200).',
            'Validasi detail S2 recast: breakdown damage per-hit (3 hit) dan kapan window cancel men-stop hit berikutnya.',
            'Apakah dash S1/S2 bisa menembus terrain/wall, dan apakah bisa dipakai tanpa target.'
          ]
        }
      }
    },
    {
      id: 'musashi',
      name: 'Musashi',
      role: 'Jungling',
      secondaryRoles: [],

      tags: ['fighter', 'assassin', 'nimble', 'soloist', 'mobility', 'melee', 'physical', 'cleanup', 'enhance', 'basic_attack_amp', 'cooldown_cut', 'dash', 'slow', 'execute', 'cc', 'crit', 'cc_immunity', 'damage_reduction', 'shield', 'launch', 'mark'],

      image: 'images/heroes/musashi.png',

      profile: {
        traits: ['Nimble', 'Soloist'],
        type: 'Fighter',
        subtype: 'Assassin Fighter',
        uniqueness: ['Mendekati', 'Cleanup'],
        power: 'Seimbang (Early, Mid, Late Game)',
        lane: 'Jungling'
      },

      skills: {
        passive: {
          name: 'Niten Ichiryuu',
          categories: ['physical', 'movement', 'cooldown_cut', 'enhance', 'basic_attack_amp', 'dash', 'slow', 'execute'],
          rawDescription: 'Skill Pasif: Niten Ichiryuu (Damage Fisik, Gerakan, Cooldown)\nMusashi mendapatkan 1 Vigor saat menggunakan Skill apa pun, maks 2 Vigor. Saat memiliki Vigor, Serangan Dasar berikutnya ditingkatkan dengan mengonsumsi 1 Vigor, tidak terpengaruhi oleh Kecepatan Serangan, dan saat menghantam musuh akan mempersingkat CD Skill 1 dan 2 sebanyak 1 Detik. Jumlah Vigor mempengaruhi efek Serangan Dasar Ditingkatkan ini.\n1 Vigor:\nJika HP target di atas 50%, Serangan Dasar berikutnya ditingkatkan menjadi tebasan dua pedang, menimbulkan 120 (120+40% Serangan Fisik ekstra) Damage Fisik.\nJika HP target kurang dari 50%, Serangan Dasar berikutnya ditingkatkan menjadi tebasan ke depan, menimbulkan 45 (45+15% Serangan Fisik ekstra)(+6% dari HP target yang hilang) Damage Fisik.\n2 Vigor:\nSerangan Dasar berikutnya berupa Dash ke arah target, menimbulkan 187 (20+100% Serangan Fisik) Damage Fisik dan Slow sebesar 25% selama 1 Detik.',
          mechanics: {
            vigor: {
              maxStacks: 2,
              persistsUntilUsed: true,
              gain: {
                event: 'on_any_skill_cast',
                includesUltimate: true,
                stacks: 1
              }
            },
            enhancedBasicAttack: {
              consumesVigorStacks: 1,
              notAffectedByAttackSpeed: true,
              countsAsBasicAttack: true,
              canCrit: true,
              appliesOnHitEffects: true,
              validTargets: ['hero', 'minion', 'monster', 'tower', 'objective'],
              onHitCooldownReduction: {
                affectsSkills: ['skill1', 'skill2'],
                seconds: 1,
                appliesWhenHitting: 'any_unit'
              },
              variantsByVigorStacksAtCast: {
                1: {
                  cleave: {
                    enabled: true,
                    radius: 'small'
                  },
                  ifTargetHpAbove50Pct: {
                    damage: {
                      physical: { baseDamage: 120, bonusPhysicalAttackPct: 40 }
                    }
                  },
                  ifTargetHpBelow50Pct: {
                    damage: {
                      physical: { baseDamage: 45, bonusPhysicalAttackPct: 15, missingTargetHpPct: 6 }
                    }
                  }
                },
                2: {
                  delivery: 'targeted_dash',
                  damage: {
                    physical: { baseDamage: 20, bonusPhysicalAttackPct: 100 }
                  },
                  crowdControl: {
                    effect: 'slow',
                    slowPct: 25,
                    durationSec: 1
                  }
                }
              },
              notes: [
                'Vigor tidak memiliki durasi; stack bertahan sampai dikonsumsi.',
                'Saat stack Vigor = 2, enhanced basic memakai varian dash+slow namun tetap hanya mengonsumsi 1 stack (2→1).',
                'On-hit CDR berlaku saat menghantam unit apa pun (bukan hanya hero).'
              ]
            }
          }
        },

        skill1: {
          name: 'Illuminating Slash',
          cdSec: 12,
          manaCost: 0,
          categories: ['physical', 'damage', 'skillshot_line', 'pierce', 'slow', 'cc_immunity'],
          rawDescription: 'Skill 1: Illuminating Slash (Knock Down, Kekebalan, Damage) (CD 12 Detik)\nMusashi melancarkan tebasan gelombang energi ke depan, menghasilkan efek Knock Down yang bisa melenyapkan proyektil musuh, menimbulkan 390 (390+130% Serangan Fisik ekstra) Damage Fisik, dan Slow sebesar 25% selama 1 Detik pada musuh yang terhantam. Selama menggunakan Skill ini, dia mendapatkan Kekebalan CC.',
          mechanics: {
            delivery: 'skillshot_line',
            piercesUnits: true,
            projectileDestroy: {
              alongPath: true,
              notes: ['Istilah "Knock Down" dianggap nama efek sapuan wave (bukan CC).']
            },
            ccImmunity: {
              duringCast: true
            },
            damage: {
              physical: { baseDamage: 390, bonusPhysicalAttackPct: 130 }
            },
            crowdControl: {
              effect: 'slow',
              slowPct: 25,
              durationSec: 1
            }
          }
        },

        skill2: {
          name: 'Extreme Speed',
          cdSec: 10,
          manaCost: 0,
          categories: ['movement', 'dash', 'physical', 'shield', 'cooldown_refund', 'multi_hit'],
          rawDescription: 'Skill 2: Extreme Speed (Gerakan, Damage Fisik, Shield) (CD 10 Detik)\nMusashi Dash ke depan, menimbulkan 210 (210 + 75% Serangan Fisik ekstra) Damage Fisik pada musuh yang terhantam di jalurnya. Jika serangan ini menghantam musuh, dia mendapatkan Shield yang menangkal 330 (330 +6% HP ekstra) Damage dan mempersingkat CD Skill ini sebesar 50%',
          mechanics: {
            delivery: 'point_dash',
            dash: {
              direction: 'to_point',
              canPassThinWalls: true,
              notes: ['Bisa menembus tembok jika tembok tidak terlalu tebal (hingga ketebalan sedang).']
            },
            multiHitAlongPath: true,
            hitRules: {
              validTargets: ['hero', 'minion', 'monster', 'objective'],
              excludes: ['tower'],
              notes: ['Skill ini tidak bisa mengenai tower.']
            },
            damage: {
              physical: { baseDamage: 210, bonusPhysicalAttackPct: 75 }
            },
            onHitAnyValidTarget: {
              shield: {
                value: { base: 330, bonusHpPct: 6 },
                durationSecApprox: 4.5,
                notes: ['Durasi shield kira-kira 4–5 detik.']
              },
              cooldown: {
                appliesTo: 'skill2',
                setCdSecOnHit: 5,
                notes: ['Cooldown diset menjadi 50% dari base (10s → 5s) jika dash menghantam unit valid.']
              }
            },
            needsValidation: {
              questions: ['Durasi shield yang tepat: 4 atau 5 detik.']
            }
          }
        },

        skill3: {
          name: 'Duel to the Death',
          cdSec: 50,
          manaCost: 0,
          categories: ['movement', 'dash', 'cc', 'launch', 'physical', 'damage_reduction', 'cc_immunity', 'mark'],
          rawDescription: 'Skill 3: Duel to the Death (Membahayakan, Crowd Control, Damage Fisik) (CD 50 Detik)\nMusashi mengincar satu Hero musuh dan Dash ke lokasinya, menimbulkan 400 (400+130% Serangan Fisik ekstra) Damage Fisik dan Launch selama 1 Detik pada musuh dalam jangkauan. Musashi lalu menerapkan Mark pada musuh tersebut dan menantangnya berduel selama 5 Detik. Semua efek Pemulihan HP target ditunda hingga duel berakhir. Selama Dash, Musashi mendapatkan Kekebalan CC dan menerima Damage 50% lebih sedikit.',
          mechanics: {
            delivery: 'targeted_dash',
            target: {
              type: 'enemy_hero',
              required: true
            },
            dash: {
              ccImmunity: true,
              damageReductionPct: 50,
              notes: ['CC immunity + damage reduction hanya selama dash.']
            },
            impact: {
              aoeRadius: 'small',
              damage: {
                physical: { baseDamage: 400, bonusPhysicalAttackPct: 130 }
              },
              crowdControl: {
                effect: 'launch',
                durationSec: 1
              },
              notes: ['Radius AoE diperkirakan kecil / melee. Target utama pasti terkena.']
            },
            duelMark: {
              durationSec: 5,
              appliesTo: 'target',
              notes: ['Mark hanya menandai status duel (tidak menciptakan dimensi/isolasi).']
            },
            healingDelayOnTargetDuringDuel: {
              durationSec: 5,
              affects: ['skill_heal', 'regen', 'lifesteal', 'healing_from_allies'],
              excludes: ['shield'],
              behavior: 'defer_until_duel_ends',
              notes: ['Semua healing target ditunda sampai duel berakhir; shield tetap bisa masuk.']
            },
            needsValidation: {
              questions: [
                'Radius AoE launch saat impact (angka unit).',
                'Healing yang ditunda: apakah benar-benar diterapkan setelah duel selesai atau hangus (misal jika target mati).'
              ]
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 177, base: 167, bonus: 10 },
          maxHP: 3300,
          maxMana: 0,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 380,
          hpRegenPer5s: 48,
          manaRegenPer5s: 0,
          attackRange: 'Melee'
        },

        level15: {
          physicalAttack: { total: 352, base: 342, bonus: 10 },
          maxHP: 6840,
          maxMana: 0,
          physicalDefense: { value: 392 },
          magicDefense: { value: 166 },
          attackSpeedBonusPct: 26,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 380,
          hpRegenPer5s: 89,
          manaRegenPer5s: 0,
          attackRange: 'Melee'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Fighter',
          playPattern: 'Assassin jungler: bangun stack Vigor lewat cast skill, weave enhanced basic untuk tempo (CDR Skill 1–2), lalu cari pick lewat Ultimate targeted dash + launch + heal delay, dan cleanup fight.',
          engageRole: 'secondary',
          notes: [
            'Skill 3 (Ultimate) adalah tombol pick/catch: targeted dash ke 1 hero + launch 1 detik + heal target ditunda selama 5 detik.',
            'Weaving enhanced basic penting untuk tempo karena tiap hit mengurangi CD Skill 1 & 2 sebanyak 1 detik.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'high',
          late: 'medium',
          notes: [
            'Mid spike kuat setelah Ultimate terbuka: punya tool pick yang reliable dan anti-sustain (heal delay) untuk menang duel pendek.',
            'Late game tetap bisa delete target, tapi lebih risk karena mudah dipunish jika commit tanpa info/peel.'
          ]
        },

        draftValues: {
          mobility: 'high',
          frontline: 'low',
          sustain: 'low',

          engage: 'high',
          disengage: 'medium',
          peel: 'low',

          cc: 'medium',
          pickPotential: 'high',

          burst: 'high',
          dps: 'medium'
        },

        crowdControl: [
          {
            source: 'passive',
            effect: 'slow',
            delivery: 'targeted_dash',
            reliability: 'high',
            durationSec: 1,
            notes: ['Enhanced basic saat Vigor = 2: dash ke target + slow 25% selama 1 detik.']
          },
          {
            source: 'skill1',
            effect: 'slow',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 1,
            notes: ['Illuminating Slash: slow 25% selama 1 detik; juga menghapus projectile di jalur wave.']
          },
          {
            source: 'skill3',
            effect: 'launch',
            delivery: 'targeted_dash',
            reliability: 'high',
            durationSec: 1,
            notes: ['Ultimate: target utama pasti terkena launch; AoE di sekitar target radius kecil/melee.']
          }
        ],

        mobilityProfile: {
          level: 'high',
          uses: ['engage', 'chase', 'reposition', 'escape'],
          notes: [
            'Skill 2: point dash (bisa multi-hit) dan bisa menembus tembok sampai ketebalan sedang.',
            'Pasif Vigor=2: enhanced basic berupa targeted dash pendek untuk chase/finisher.',
            'Ultimate: targeted dash untuk engage/pick; saat dash mendapat CC immunity + damage reduction 50%.'
          ]
        },

        teamNeeds: {
          needs: [
            'Vision/info target untuk memaksimalkan pick dari Ultimate (hindari commit blind).',
            'Follow-up damage cepat selama window launch (1 detik) dan duel window 5 detik.',
            'Peel/CC chain dari tim untuk mengamankan Musashi setelah commit (atau untuk lock target sebelum Musashi masuk).'
          ]
        },

        counterplay: {
          counteredBy: [
            'Peel + chain hard CC saat Musashi commit dash (punish setelah CC immunity window berakhir).',
            'Spacing agar AoE launch tidak mengenai banyak target sekaligus.',
            'Kontrol vision dan deny flank angle supaya Musashi sulit menemukan pick aman.'
          ]
        },

        needsValidation: {
          questions: [
            'Durasi shield Skill 2 yang tepat: 4 atau 5 detik.',
            'Radius AoE launch saat impact Skill 3 (Ultimate) belum tervalidasi; sementara dianggap radius kecil/melee.',
            'Heal yang ditunda selama duel: apakah benar-benar diterapkan setelah duel selesai atau hangus (misal jika target mati).',
            'Apakah heal delay juga menunda heal dari ally (support) secara konsisten.'
          ]
        }
      }
    },
    {
      id: 'kaizer',
      name: 'Kaizer',
      role: 'Clash Lane',
      secondaryRoles: ['Jungling'],

      tags: ['fighter', 'tank', 'soloist', 'late_game', 'melee', 'physical', 'cc', 'slow', 'launch', 'dash', 'zone', 'recovery', 'cooldown_cut', 'attack_speed', 'single_target_amp', 'duelist', 'cleave'],

      image: 'images/heroes/kaizer.png',

      profile: {
        traits: ['Tank', 'Soloist'],
        type: 'Fighter/Tank',
        subtype: 'Assassin Fighter',
        uniqueness: [],
        power: 'Late Game',
        lane: 'Clash Lane',
        sub: 'Jungling'
      },

      skills: {
        passive: {
          name: 'Demon Soul',
          categories: ['physical', 'damage_amp', 'single_target'],
          rawDescription: 'Skill Pasif: Demon Soul (Damage Fisik)\nSerangan Dasar dan Skill 2 Kaizer menimbulkan 50% Damage Fisik tambahan saat hanya menghantam satu musuh.',
          mechanics: {
            sources: ['basic_attack', 'skill2'],
            condition: {
              hitsExactlyOneEnemyUnit: true,
              scope: 'all_enemy_units',
              notes: [
                'Dihitung untuk semua unit musuh (hero, minion, monster).',
                'Basic Attack Kaizer punya cleave/splash yang selalu aktif, sehingga bonus damage sering tidak aktif saat ada unit lain di sekitar target.',
                'Dari testing user: bonus damage tampak sebagai peningkatan damage akhir (post-mitigation), bukan pre-armor.'
              ]
            },
            damageModifier: {
              type: 'post_mitigation_multiplier',
              bonusDamagePct: 50,
              totalDamageMultiplier: 1.5,
              damageType: 'physical',
              notes: ['Model sementara: 1.5x total damage ketika syarat single target terpenuhi.']
            }
          }
        },

        skill1: {
          name: 'Vortex Brand',
          cdSec: 9,
          manaCost: 40,
          categories: ['cc', 'slow', 'physical', 'damage', 'recovery', 'attack_speed', 'speed_up', 'cooldown_cut', 'skillshot_line', 'multi_target'],
          rawDescription: 'Skill 1: Vortex Brand (Slow, Damage Fisik, Recovery) (CD 9 Detik) Konsumsi Mana: 40\nKaizer melemparkan pisau ke arah target, menimbulkan 300 (300+85% Serangan Fisik ekstra) Damage Fisik dan Slow Ekstrem selama 1 Detik pada musuh pertama yang terhantam.\nPisau ini kemudian memantul di antara musuh di sekitar (setiap musuh hanya bisa terhantam satu kali), setiap hantaman menimbulkan jumlah Damage yang sama besar dan Slow sebesar 15% pada target selama 2 Detik.\nJika pisau ini menghantam setidaknya satu musuh, pisau tersebut akan kembali padanya, dan dia memulihkan 350 (350+5% HP ekstra) HP. CD Skill ini juga berkurang 30%, dan dia mendapatkan 15% Kecepatan Serangan serta 15% Kecepatan Gerakan selama 3 Detik.',
          mechanics: {
            delivery: 'skillshot_line',
            projectile: {
              canMiss: true,
              blocksOnNonHero: true,
              blocksOnHero: true,
              notes: ['Hit unit pertama lalu lanjut sebagai chain bounce.']
            },
            chainBounce: {
              maxTotalTargets: 4,
              includesFirstHit: true,
              canHitSameTargetTwice: false,
              validTargets: ['hero', 'minion', 'monster'],
              notes: ['Dari observasi user: bisa memantul ke minion/monster.']
            },
            hit: {
              damage: { physical: { baseDamage: 300, bonusPhysicalAttackPct: 85 } },
              crowdControl: {
                effect: 'slow',
                slowPct: 'unknown',
                durationSec: 1,
                notes: ['Slow "ekstrem" (angka % belum dicatat).']
              }
            },
            bounceHit: {
              damage: { physical: { baseDamage: 300, bonusPhysicalAttackPct: 85 } },
              crowdControl: {
                effect: 'slow',
                slowPct: 15,
                durationSec: 2
              }
            },
            onReturnIfHitAtLeastOneTarget: {
              returnHasTravelDelay: true,
              selfHeal: { flat: 350, bonusMaxHpPct: 5 },
              cooldownReduction: {
                appliesTo: 'skill1',
                cooldownReductionPct: 30,
                model: 'remaining_cooldown_cut'
              },
              selfBuff: {
                durationSec: 3,
                attackSpeedBonusPct: 15,
                moveSpeedBonusPct: 15
              }
            }
          }
        },

        skill2: {
          name: 'Blade Tempest',
          cdSec: 6,
          manaCost: 35,
          categories: ['cc', 'launch', 'physical', 'damage', 'recovery', 'enhance', 'basic_attack_amp', 'movement', 'dash', 'skillshot_line', 'multi_hit', 'multi_target'],
          rawDescription: 'Skill 2: Blade Tempest (CC, Recovery, Damage Fisik) (CD 6 Detik) Konsumsi Mana 35\nKaizer melancarkan dua tebasan ke arah target, di mana setiap tebasan menimbulkan 160 (160 + 60% Serangan Fisik ekstra) Damage Fisik. Tebasan kedua membuat musuh terkena efek Launch selama 1 Detik. Serangan Dasar berikutnya akan ditingkatkan, membuatnya Dash ke target dan menimbulkan 130 (130 + 35% Serangan Fisik ekstra) Damage Fisik tambahan.\nPasif: Setelah meninggalkan pertempuran, dia mendapatkan 10 Kecepatan Gerakan dan memulihkan 1% HP dan Mana maksimum miliknya setiap Detik.',
          mechanics: {
            delivery: 'skillshot_line',
            line: {
              range: 'short',
              width: 'wide',
              passesThroughUnits: true,
              notes: ['User observasi: indikator berupa short line yang cukup lebar dan tebasan menembus unit.']
            },
            hits: {
              count: 2,
              damagePerHit: { physical: { baseDamage: 160, bonusPhysicalAttackPct: 60 } },
              crowdControlOnSecondHit: {
                effect: 'launch',
                durationSec: 1,
                appliesTo: 'all_units_hit'
              }
            },
            enhancedBasicAttack: {
              applies: true,
              triggers: 'next_basic_attack',
              delivery: 'targeted_dash',
              validTargets: ['hero', 'minion', 'monster'],
              retainsCleaveSplash: true,
              bonusDamage: { physical: { baseDamage: 130, bonusPhysicalAttackPct: 35 } },
              notes: [
                'Enhanced basic menggantikan basic sepenuhnya dan tetap membawa cleave/splash.',
                'Interaksi pasif Demon Soul: bonus single-target hanya aktif jika Skill 2 dan dash hanya mengenai 1 unit musuh.'
              ]
            },
            outOfCombatPassive: {
              activatesAfterSecApprox: { min: 5, max: 6 },
              moveSpeedFlat: 10,
              hpRegenPctMaxPerSec: 1,
              manaRegenPctMaxPerSec: 1,
              resetsOnCombatWith: ['hero', 'minion', 'monster'],
              notes: ['Angka delay out-of-combat masih perkiraan dari testing user; butuh angka pasti.']
            }
          }
        },

        skill3: {
          name: 'Invincible Warrior',
          cdSec: 60,
          manaCost: 120,
          categories: ['block', 'speed_up', 'enhance', 'magic', 'damage', 'aoe', 'zone', 'multi_hit'],
          rawDescription: 'Skill 3: Invicible Warrior (Blok, Gerak Cepat, Tingkatkan) (CD 60 Detik) Konsumsi Mana 120\nKaizer memakai setelan armor demoniknya. Setelah jeda 1 Detik, dia menimbulkan 250 (250 + 25% Serangan Fisik ekstra) Damage Magis pada musuh di sekitar dan meningkatkan dirinya selama 8 Detik. Saat ditingkatkan, dia mendapatkan 500 HP, 100 Serangan Fisik, 50 Kecepatan Gerakan, dan 60 Blokir, sambil menimbulkan 50 (50 + 16% Serangan Fisik ekstra) Damage Magis pada musuh di sekitarnya setiap 0,5 Detik.',
          mechanics: {
            delivery: 'aoe_self_delayed',
            delaySec: 1,
            notes: ['User observasi: buff baru aktif setelah windup 1 detik selesai.'],
            initialBurst: {
              damage: { magic: { baseDamage: 250, bonusPhysicalAttackPct: 25 } }
            },
            selfBuff: {
              durationSec: 8,
              bonusMaxHpFlat: 500,
              bonusPhysicalAttackFlat: 100,
              bonusMoveSpeedFlat: 50,
              block: {
                value: 60,
                definition: 'unknown'
              },
              aura: {
                tickIntervalSec: 0.5,
                damagePerTick: { magic: { baseDamage: 50, bonusPhysicalAttackPct: 16 } },
                notes: ['Radius aura belum dicatat.']
              }
            },
            interruptibility: {
              canBeInterruptedDuringWindup: 'unknown',
              notes: ['User observasi: jika sudah dipencet, efek terasa tetap jalan; butuh validasi apakah bisa dibatalkan hard CC saat windup.']
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 188, base: 188, bonus: 0 },
          maxHP: 3476,
          maxMana: 580,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 0,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 385,
          hpRegenPer5s: 44,
          manaRegenPer5s: 14,
          attackRange: 'Melee'
        },

        level15: {
          physicalAttack: { total: 346, base: 346, bonus: 0 },
          maxHP: 7446,
          maxMana: 1160,
          physicalDefense: { value: 409 },
          magicDefense: { value: 178 },
          attackSpeedBonusPct: 28,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 385,
          hpRegenPer5s: 81,
          manaRegenPer5s: 28,
          attackRange: 'Melee'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Fighter/Tank',
          engageRole: 'secondary',
          playPattern: 'Bruiser diver dengan power window besar saat Ultimate aktif. Cari flank/angle untuk nempel target prioritas. Lebih kuat saat duel/area kosong karena pasif Demon Soul butuh hit 1 unit; di fight rame/wave sering kehilangan bonus damage.',
          notes: [
            'S1: skillshot line bisa dibody-block; on-return memberi heal + AS/MS untuk chase/tempo.',
            'S2: tebasan short-wide line pierce; hit ke-2 launch 1s (AoE). Setelah itu ada enhanced basic dash.',
            'Ultimate: windup 1s lalu mode demon 8s (HP/AD/MS/Block + aura magic tick 0.5s).'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'medium',
          late: 'high',
          notes: [
            'Early stabil untuk trade singkat dan kontrol tempo lewat S1 (heal + CD cut) dan S2 (launch).',
            'Late naik karena scaling bonus AD + Ultimate steroid besar (window teamfight/objektif).'
          ]
        },

        draftValues: {
          mobility: 'medium',
          frontline: 'medium',
          sustain: 'medium',

          engage: 'medium',
          disengage: 'low',
          peel: 'low',

          cc: 'medium',
          pickPotential: 'medium',

          burst: 'medium',
          dps: 'medium'
        },

        crowdControl: [
          {
            source: 'skill1',
            effect: 'slow',
            delivery: 'skillshot_line',
            reliability: 'low',
            durationSec: 1,
            notes: ['Slow "ekstrem" 1s pada unit pertama; angka % belum tervalidasi; bisa miss dan bisa dibody-block.']
          },
          {
            source: 'skill1',
            effect: 'slow',
            delivery: 'targeted_multi',
            reliability: 'medium',
            durationSec: 2,
            notes: ['Slow 15% 2s dari bounce hit; bisa mengenai beberapa target (termasuk minion/monster).']
          },
          {
            source: 'skill2',
            effect: 'launch',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 1,
            notes: ['Launch 1s pada semua unit yang kena tebasan ke-2 (AoE).']
          }
        ],

        mobilityProfile: {
          level: 'medium',
          uses: ['engage', 'chase', 'reposition'],
          notes: [
            'Dash utama dari enhanced basic setelah S2 (targeted_dash).',
            'MS spike dari S1 (return buff) dan Ultimate (+50 MS) untuk run-down.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Sun Bin', compatibilityPct: 1.85 },
            { externalName: 'Gan & Mo', compatibilityPct: 1.58 }
          ],
          trio: [
            { externalNames: ['Sun Bin', 'Dr Bian'], compatibilityPct: 4.35 },
            { externalNames: ['Dolia', 'Heino'], compatibilityPct: 3.63 }
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh setup/CC dari tim agar Kaizer bisa masuk tanpa kena kite/peel dari awal.',
            'Butuh follow-up damage dari backline (marksman/mage) saat Kaizer tarik perhatian.',
            'Lebih suka fight di area sempit/tanpa wave agar Demon Soul lebih sering aktif (hindari minion/monster menempel ke target utama).'
          ]
        },

        counterplay: {
          counteredBy: [
            'Kite + peel (slow/knockback/pull) dan jaga jarak saat Ultimate aktif.',
            'Fight di wave/objective yang ramai untuk mematikan Demon Soul (hit jadi >1 unit).',
            'Body-block S1 dengan minion/frontliner agar slow ekstrem tidak kena target prioritas.',
            'Disengage saat windup Ultimate 1s (atau punish saat Ultimate down).'
          ]
        },

        needsValidation: {
          questions: [
            'Skill 3 Invincible Warrior: definisi stat Block (60) — damage type apa yang diblok dan bentuknya (flat vs % vs chance).',
            'Skill 3 Invincible Warrior: apakah bisa di-cancel/di-interrupt saat windup 1 detik oleh hard CC?',
            'Skill 3 Invincible Warrior: radius AoE burst & aura (perkiraan unit) untuk valuasi teamfight.',
            'Skill 2 Blade Tempest: angka pasti delay out-of-combat untuk aktif regen (estimasi 5–6 detik).',
            'Skill 1 Vortex Brand: angka % slow "ekstrem" (hit pertama) yang tepat.',
            'Skill 1 Vortex Brand: apakah heal/buff aktif jika hanya mengenai minion/monster (tanpa hero).',
            'Validasi pasif Demon Soul: pastikan bonus +50% benar post-mitigation (setelah armor) dan bentuknya 1.5x multiplier (bukan instance damage tambahan).',
            'Konfirmasi identitas: apakah Kaizer lebih condong bruiser/tank extended fight atau assassin-fighter burst/pick.'
          ]
        }
      }
    },
    {
      id: 'mozi',
      name: 'Mozi',
      role: 'Mid Lane',
      secondaryRoles: ['Roaming'],

      tags: ['mage', 'fighter', 'control', 'late_game', 'melee', 'magic', 'cc', 'shield'],

      image: 'images/heroes/mozi.png',

      profile: {
        type: 'Mage/Fighter',
        subtype: 'Control Mage',
        uniqueness: ['CC', 'Shield'],
        power: 'Late Game',
        lane: 'Mid Lane'
      },

      skills: {
        passive: {
          name: 'Fight for Peace',
          categories: ['cc', 'magic', 'damage', 'shield', 'knockback', 'enhance', 'basic_attack_amp'],
          rawDescription: 'Skill Pasif: Fight for Peace (CC, Damage Magis, Shield)\nSetiap Serangan Dasar ke-4 akan ditingkatkan, menimbulkan 450 (450+70% Serangan Magis) Damage Magis pada musuh dalam jangkauan dan membuat mereka terpukul mundur selama 0,75 Detik. Setiap kali dia menggunakan Skill, dia mendapatkan 1 tumpukan Shield selama 3 Detik, hingga 3 tumpukan. Setiap tumpukan menangkal 300 (300+35% Serangan Magis) Damage.',
          mechanics: {
            enhancedBasicAttack: {
              triggersOnBasicAttackCount: 4,
              delivery: 'aoe_self',
              affectsMultipleTargets: true,
              damage: {
                magic: { baseDamage: 450, bonusMagicAttackPct: 70 }
              },
              crowdControl: {
                effect: 'knockback',
                durationSec: 0.75
              }
            },
            shieldOnSkillCast: {
              maxStacks: 3,
              durationSec: 3,
              refreshesDurationOnStackGain: 'likely',
              absorbPerStack: { base: 300, bonusMagicAttackPct: 35 },
              notes: ['Dari observasi user: saat stack bertambah, durasi shield tampak di-refresh kembali ke 3 detik (tidak ada icon, jadi belum 100% terverifikasi).']
            }
          }
        },

        skill1: {
          name: 'Peacebringer',
          cdSec: 10,
          manaCost: 70,
          categories: ['mobility', 'dash', 'enhance', 'magic', 'damage'],
          rawDescription: 'Skill 1: Peacebringer (Gerakan, Tingkatkan, Damage Magis) (CD 10 Detik) Konsumsi Mana 70\nMozi Dash ke arah yang ditentukan, menimbulkan 250 (250+38% Serangan Magis) Damage Magis pada musuh yang terhantam dan meningkatkan Serangan Dasar berikutnya.',
          mechanics: {
            delivery: 'dash_forward',
            dash: {
              passesThroughUnits: true
            },
            damage: {
              magic: { baseDamage: 250, bonusMagicAttackPct: 38 }
            },
            empowersPassiveEnhancedBasicAttack: {
              setsPassiveEnhancedBasicReady: true,
              windowSec: 3,
              notes: ['Mengaktifkan enhanced basic dari pasif (basic ke-4/knockback AoE) tanpa perlu memukul dulu.']
            }
          }
        },

        skill2: {
          name: 'Cannon Blast',
          cdSec: 7,
          manaCost: 40,
          categories: ['cc', 'magic', 'damage', 'stun', 'zone', 'aoe', 'skillshot'],
          rawDescription: 'Skill 2: Cannon Blast (CC, Damage Magis) (CD 7 Detik) Konsumsi Mana 40\nMozi menembakkan peluru ke arah yang ditentukan. Peluru akan meledak saat menghantam musuh atau mencapai jangkauan maksimumnya, meninggalkan kawah berlistrik.\nLedakan itu menimbulkan 525 (525+45% Serangan Magis) Damage Magis pada musuh dalam jangkauan dan membuat mereka Stun selama 1 Detik.\nKawah berlistrik ini akan aktif selama 4 Detik dan menimbulkan 50 (50+5% Serangan Magis) Damage Magis pada musuh dalam jangkauan setiap 0,5 Detik.',
          mechanics: {
            delivery: 'skillshot_line',
            projectile: {
              explodesOnHitOrMaxRange: true,
              alwaysCreatesCraterOnExplode: true,
              bodyBlockByUnits: 'unknown',
              notes: ['Jika proyektil kena unit, ledakan terjadi di titik impact; jika miss, meledak di max range dan tetap meninggalkan kawah.']
            },
            impact: {
              area: {
                type: 'circle',
                radius: 'unknown'
              },
              damage: {
                magic: { baseDamage: 525, bonusMagicAttackPct: 45 }
              },
              crowdControl: {
                effect: 'stun',
                durationSec: 1,
                appliesTo: 'all_units_in_radius'
              }
            },
            crater: {
              durationSec: 4,
              tickIntervalSec: 0.5,
              effects: {
                damage: {
                  magicPerTick: { baseDamage: 50, bonusMagicAttackPct: 5 }
                }
              },
              area: {
                type: 'circle',
                radius: 'unknown'
              }
            }
          }
        },

        skill3: {
          name: 'Think Inside the Box',
          cdSec: 50,
          manaCost: 100,
          categories: ['cc', 'magic', 'damage', 'stun', 'zone', 'aoe'],
          rawDescription: 'Skill 3: Think Inside the Box (CC, Damage Magis) (CD 50 Detik) Konsumsi Mana 100\nMozi membuat Energy Barrier di sekitar dirinya yang aktif hingga 3,3 Detik. Setiap 0,5 Detik, Energy Barrier akan menimbulkan 200 (200+45% Serangan Magis) Damage Magis dan membuat musuh yang menyentuhnya terkena Stun.',
          mechanics: {
            delivery: 'aoe_self',
            barrier: {
              durationSec: 3.3,
              tickIntervalSec: 0.5,
              tick: {
                damage: {
                  magic: { baseDamage: 200, bonusMagicAttackPct: 45 }
                },
                crowdControl: {
                  effect: 'stun',
                  durationSec: 0.5,
                  reappliesEachTick: true,
                  appliesWhen: 'enemy_touches_barrier'
                }
              },
              area: {
                type: 'circle',
                radius: 'unknown',
                notes: ['Range terasa melee/short; stun terjadi saat musuh menyentuh barrier (bukan harus berada di tengah).']
              }
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 178, base: 178, bonus: 0 },
          magicAttack: { total: 0, base: 0, bonus: 0 },
          maxHP: 3372,
          maxMana: 640,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 370,
          hpRegenPer5s: 76,
          manaRegenPer5s: 16,
          attackRange: 'Melee'
        },

        level15: {
          physicalAttack: { total: 340, base: 340, bonus: 0 },
          magicAttack: { total: 0, base: 0, bonus: 0 },
          maxHP: 6925,
          maxMana: 1280,
          physicalDefense: { value: 409 },
          magicDefense: { value: 212 },
          attackSpeedBonusPct: 26,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 370,
          hpRegenPer5s: 167,
          manaRegenPer5s: 32,
          attackRange: 'Melee'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Mage/Fighter',
          engageRole: 'secondary',
          playPattern: 'Control mage/fighter untuk pick + zone + peel. Cari angle skillshot stun untuk membuka fight, lalu gunakan crater + ultimate barrier untuk mengunci ruang. Bisa maju beberapa step karena shield stacking, tapi bukan primary engager yang tahan lama tanpa backup.',
          notes: [
            'S1: dash pierce + memaksa pasif ready (knockback AoE) selama 3s → tool reposition + force CC.',
            'S2: skillshot stun AoE + crater 4s → pick tool sekaligus zoning choke/objektif.',
            'Ultimate: barrier melee yang stun chain per tick → anti-dive/peel sangat kuat saat musuh memaksa masuk.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'medium',
          late: 'high',
          notes: [
            'Early sudah punya threat CC (S1 knockback on-demand + S2 stun) untuk roam/pick.',
            'Late makin kuat karena scaling damage skill + durability terasa dari shield stacking saat spam skill.'
          ]
        },

        draftValues: {
          mobility: 'medium',
          frontline: 'medium',
          sustain: 'medium',

          engage: 'medium',
          disengage: 'high',
          peel: 'high',

          cc: 'high',
          pickPotential: 'high',

          burst: 'medium',
          dps: 'medium'
        },

        crowdControl: [
          {
            source: 'passive.enhancedBasicAttack',
            effect: 'knockback',
            delivery: 'aoe_self',
            reliability: 'high',
            durationSec: 0.75,
            notes: ['Proc tiap basic ke-4; juga bisa di-force via Skill 1 dalam window 3 detik.']
          },
          {
            source: 'skill2.impact',
            effect: 'stun',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 1,
            notes: ['Stun AoE di radius ledakan; sangat menentukan untuk pick.']
          },
          {
            source: 'skill3.barrier.tick',
            effect: 'stun',
            delivery: 'aoe_self',
            reliability: 'high',
            durationSec: 0.5,
            notes: ['Stun re-apply tiap tick (0,5s) selama musuh menyentuh barrier; terasa seperti stun chain.']
          }
        ],

        mobilityProfile: {
          level: 'medium',
          uses: ['reposition', 'engage', 'escape'],
          notes: [
            'Dash S1 pierce memberi opsi masuk untuk force knockback atau reposition defensif.',
            'Mobilitas tergantung cooldown; Mozi bukan blink hero.'
          ]
        },

        teamNeeds: {
          needs: [
            'Butuh follow-up damage dari tim untuk mengkonversi stun (pick) jadi kill.',
            'Suka komposisi yang bisa memaksa fight di choke/objektif agar crater + barrier dapat value maksimum.',
            'Butuh teman yang bisa menahan jarak musuh/menjaga Mozi saat ia maju untuk zoning.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Outrange/poke yang memaksa Mozi tidak bisa berdiri dekat area (barrier butuh jarak melee).',
            'Disengage dan sabar menunggu window ultimate habis sebelum commit.',
            'Bait skillshot S2 lalu punish saat cooldown (7s) dan Mozi kehilangan pick tool utama.'
          ],
          notes: [
            'Jika Mozi tidak bisa mengenai S2 atau tidak bisa “memegang area”, value-nya turun signifikan.'
          ]
        },

        needsValidation: {
          questions: [
            'Jangkauan serangan tercatat Melee — validasi apakah basic attack Mozi memang melee di client (atau seharusnya ranged).',
            'Serangan Magis base tercatat 0 — validasi apakah ini memang stat yang ditampilkan client, dan scaling skill menggunakan apa.',
            'Skill 2 Cannon Blast: apakah proyektil bisa dibody-block minion/monster (meledak di unit pertama) atau menembus sampai max range.',
            'Skill 2 Cannon Blast: radius ledakan dan radius kawah berlistrik (unit).',
            'Skill 3 Think Inside the Box: radius Energy Barrier (unit).'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Shouyue', compatibilityPct: 8.97 },
            { externalName: 'Lian Po', compatibilityPct: 4.70 },
            { externalName: 'Gao', compatibilityPct: 1.88 },
            { externalName: 'Dian Wei', compatibilityPct: 1.67 }
          ],
          trio: [
            { externalNames: ['Wukong', 'Shouyue'], compatibilityPct: 14.12 },
            { externalNames: ['Dian Wei', 'Shouyue'], compatibilityPct: 7.89 },
            { externalNames: ['Luban', 'Gao'], compatibilityPct: 4.88 }
          ]
        }
      }
    },
    {
      id: 'arli',
      name: 'Arli',
      role: 'Farm Lane',
      secondaryRoles: [],

      tags: ['marksman', 'nimble', 'cleanup', 'physical', 'ranged'],

      image: 'images/heroes/arli.png',

      profile: {
        type: 'Marksman',
        subtype: 'Nimble Marksman',
        uniqueness: ['Mendekati', 'Cleanup'],
        power: 'Seimbang (Early, Mid, Late Game)',
        lane: 'Farm Lane'
      },

      skills: {
        passive: {
          name: 'Falling Leaves',
          categories: ['mark', 'enhance', 'physical', 'basic_attack_amp'],
          rawDescription: 'Skill Pasif: Falling Leaves (Mark, Tingkatkan, Damage Fisik)\nSerangan Dasar Arli menempatkan 1 tumpukan Maple pada musuh selama 5 Detik, maks 4 tumpukan. Saat tumpukan mencapai maksimum, Maple tersebut meledak, menimbulkan 220 (220+ 40% Serangan Fisik ekstra) Damage Fisik pada target dan musuh di sekitarnya, serta menempatkan 1 tumpukan Maple pada mereka.\nJika dia menggunakan Skill aktif, dia dapat menggunakannya lagi dalam 4 Detik untuk berteleportasi ke lokasi Parasol dan mengambilnya. Jika tidak diambil, Parasol akan otomatis kembali setelah 4 Detik. Saat tidak memegang Parasol, dia mendapatkan 30-60 Kecepatan Gerakan dan 10-20% Kecepatan Serangan (meningkat sesuai Level).\nSetiap kali dia menggunakan Skill atau mengambil Parasol, Serangan Dasar berikutnya akan ditingkatkan, melancarkan Serangan Dasar tambahan yang menimbulkan 53 (20+20% Serangan Fisik) Damage Fisik. Dia bisa menampung maks 2 Serangan Dasar Ditingkatkan.',
          mechanics: {
            maple: {
              type: 'mark',
              name: 'Maple',
              durationSec: 5,
              maxStacks: 4,
              applyOn: 'basic_attack_hit',
              stacksPerHit: 1,
              onMaxStacks: {
                explosion: {
                  damage: {
                    physical: { baseDamage: 220, bonusPhysicalAttackPct: 40 }
                  },
                  area: {
                    type: 'circle',
                    radius: 'melee_short'
                  },
                  onHit: {
                    applyMapleStacks: 1,
                    canChainDetonate: true
                  },
                  notes: [
                    'Radius ledakan terasa melee/short (angka unit belum dicatat).',
                    'Aplikasi stack dari ledakan bisa memicu ledakan berantai jika unit lain mencapai 4 stack.'
                  ]
                }
              }
            },

            parasol: {
              recastTeleportWindowSec: 4,
              autoReturnAfterSec: 4,
              buffsWhileNotHoldingParasol: {
                moveSpeedFlat: { min: 30, max: 60, scalesWith: 'hero_level' },
                attackSpeedBonusPct: { min: 10, max: 20, scalesWith: 'hero_level' }
              }
            },

            enhancedBasicAttack: {
              maxCharges: 2,
              gainOn: ['skill_cast', 'parasol_pickup'],
              extraHit: {
                countsAsBasicAttack: true,
                canCrit: true,
                appliesOnHitEffects: true,
                appliesMapleStack: true,
                damage: {
                  physical: { baseDamage: 20, bonusPhysicalAttackPct: 20 }
                },
                notes: ['Scaling dinyatakan memakai total Serangan Fisik (bukan hanya bonus).']
              }
            }
          }
        },

        skill1: {
          name: 'Lithe Step',
          cdSec: 7.5,
          manaCost: 50,
          categories: ['mobility', 'movement', 'dash'],
          rawDescription: 'Skill 1: Lithe Step (Gerakan) (CD 7,5 Detik) Konsumsi Mana: 50\nArli berpindah ke arah target.\nJika dia sedang membawa Parasol, Parasol ini akan ditinggalkan di lokasi awal sebelum dia berpindah tempat.',
          mechanics: {
            delivery: 'point_dash',
            dash: {
              direction: 'to_point',
              range: 'medium',
              canPassThinWalls: true,
              notes: ['Jarak dash terasa di antara short dan medium (angka unit belum dicatat).']
            },
            parasolInteraction: {
              leavesParasolAtCastStartIfHolding: true,
              notes: ['Jika Arli memegang Parasol, Parasol ditinggalkan di lokasi awal sebelum berpindah.']
            },
            needsValidation: {
              questions: [
                'Jarak dash Lithe Step (unit).',
                'Ambang ketebalan dinding yang masih bisa ditembus (thin wall threshold).'
              ]
            }
          }
        },

        skill2: {
          name: 'Maple Dance',
          cdSec: 11,
          manaCost: 60,
          categories: ['magic', 'damage', 'aoe', 'multi_hit', 'utility'],
          rawDescription: 'Skill 2: Maple Dance (Knockdown, Damage Magis) (CD 11 Detik) Konsumsi Mana: 60\nArli menyerang musuh di sekitar dua kali, masing-masing serangan menimbulkan 300 (300+72% Serangan Fisik ekstra) Damage Magis. Menggunakan Skill ini juga akan melenyapkan proyektil musuh di sekitar.\nJika dia sedang memegang Parasol, Parasolnya akan terbang mengelilingi lokasi tempatnya melancarkan Skill.',
          mechanics: {
            delivery: 'aoe_self',
            area: {
              radius: 'medium',
              notes: ['Radius serangan terasa medium (angka unit belum dicatat).']
            },
            multiHit: {
              count: 2,
              notes: ['Interval antar hit belum dicatat.']
            },
            damage: {
              magicPerHit: { baseDamage: 300, bonusPhysicalAttackPct: 72 }
            },
            projectileDestroy: {
              atCast: true,
              area: { radius: 'medium' },
              includesBasicAttackProjectiles: true,
              excludesTowerShots: true,
              notes: ['Istilah "Knock Down" dianggap efek sapuan projectile-destroy (bukan CC).']
            },
            parasolInteraction: {
              ifHoldingParasol: {
                parasolOrbitsCastPoint: true,
                orbitDurationSec: 4,
                notes: ['Durasi orbit sinkron dengan window recast teleport dari pasif (4 detik).']
              },
              teleportRecastTargetsParasol: true,
              notes: ['Recast teleport dari pasif menuju posisi Parasol (payung) saat itu.']
            },
            needsValidation: {
              questions: [
                'Interval antar hit Maple Dance.',
                'Radius pasti Maple Dance & projectile-destroy (unit).'
              ]
            }
          }
        },

        skill3: {
          name: 'Autumn Storm',
          cdSec: 25,
          manaCost: 90,
          categories: ['cc', 'magic', 'damage', 'knockback', 'skillshot_line', 'pierce', 'utility'],
          rawDescription: 'Skill 3: Autumn Storm (CC, Damage Magis) (CD 25 Detik) Konsumsi Mana: 90\nArli menimbulkan 400 (400+90% Serangan Fisik ekstra) Damage Magis pada musuh di arah target dan membuat mereka terpukul mundur.\nJika dia sedang memegang Parasol, dia akan melemparkan ke arah yang sama. Setelah mencapai jarak tertentu, Parasol akan terus terbang dengan kecepatan lebih lambat.',
          mechanics: {
            delivery: 'skillshot_line',
            piercesUnits: true,
            line: {
              range: 'medium',
              width: 'wide',
              notes: ['Lebar serangan terasa "wide-ish" (tidak super lebar).']
            },
            damage: {
              magic: { baseDamage: 400, bonusPhysicalAttackPct: 90 }
            },
            displacement: {
              type: 'knockback',
              isCrowdControl: true,
              model: 'push_to_line_end',
              notes: [
                'Jarak knockback variabel: semakin dekat target saat terkena, semakin jauh terdorong.',
                'Secara praktik mendorong target sepanjang arah skill hingga mendekati ujung garis.'
              ]
            },
            parasolInteraction: {
              ifHoldingParasol: {
                throwsParasol: true,
                direction: 'same_as_skill',
                travel: {
                  phase1: { speed: 'fast', distance: 'medium' },
                  phase2: { speed: 'slow', durationSec: 4, untilRecastWindowEnds: true }
                },
                recastTeleportTargetsParasolWhileMoving: true,
                notes: ['Parasol terus bergerak selama window recast pasif (4 detik).']
              },
              notes: ['Recast teleport dari pasif menuju posisi Parasol (payung) saat itu (dinamis).']
            },
            needsValidation: {
              questions: [
                'Range dan width Autumn Storm (unit).',
                'Konfirmasi model knockback: benar mengikuti sisa jarak ke ujung line (push-to-line-end).'
              ]
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 175, base: 175, bonus: 0 },
          magicAttack: { total: 0, base: 0, bonus: 0 },
          maxHP: 3219,
          maxMana: 600,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 10,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 39,
          manaRegenPer5s: 15,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 373, base: 373, bonus: 0 },
          magicAttack: { total: 0, base: 0, bonus: 0 },
          maxHP: 6049,
          maxMana: 1200,
          physicalDefense: { value: 332 },
          magicDefense: { value: 178 },
          attackSpeedBonusPct: 38,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 360,
          hpRegenPer5s: 69,
          manaRegenPer5s: 30,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Marksman',
          engageRole: 'secondary',
          playPattern:
            'Nimble marksman hit-and-run berbasis Parasol: gunakan cast skill untuk menaruh anchor lalu manfaatkan window 4 detik untuk teleport/reposition. Cari DPS lewat basic + enhanced basic (extra-hit) sambil menumpuk Maple sampai detonasi AoE. Punya tool defensif anti-projectile (Skill 2) dan knockback line (Ult) untuk jaga jarak / peel.',
          notes: [
            'Win condition: jaga tempo Parasol (anchor + teleport 4s) untuk selalu menang positioning sebelum dan selama teamfight.',
            'Skill 2: AoE 2-hit magic + projectile destroy (termasuk basic projectile marksman) = anti-poke / self-peel penting.',
            'Ultimate: line pierce + knockback variabel + lempar Parasol dinamis 4s = tombol spacing/disengage sekaligus setup reposition agresif.',
            'Saat tidak memegang Parasol dapat MS/AS bonus → reward untuk parasol management yang rapi.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'high',
          late: 'high',
          notes: [
            'Scaling DPS tetap marksman (item), tapi spike mid terasa karena kit mobility + burst magic scaling bonus PA.',
            'Teamfight value naik ketika Maple detonation konsisten dan Arli bisa aman weaving masuk-keluar fight.'
          ]
        },

        draftValues: {
          mobility: 'high',
          frontline: 'low',
          sustain: 'low',

          engage: 'low',
          disengage: 'high',
          peel: 'medium',

          cc: 'low',
          pickPotential: 'low',

          burst: 'low',
          dps: 'high'
        },

        crowdControl: [
          {
            source: 'skill3',
            effect: 'knockback',
            delivery: 'skillshot_line',
            reliability: 'medium',
            notes: [
              'Knockback variabel (model push-to-line-end): target dekat terdorong lebih jauh.',
              'Dipakai untuk spacing, peel, dan memecah frontline musuh.'
            ]
          }
        ],

        mobilityProfile: {
          level: 'high',
          uses: ['reposition', 'escape', 'chase'],
          notes: [
            'Skill 1: dash point (bisa tembus thin wall).',
            'Pasif: setelah cast skill aktif, ada recast teleport 4s ke Parasol (dinamis).',
            'Ult bisa lempar anchor (Parasol bergerak 4s) untuk reposition jarak lebih jauh.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { externalName: 'Yaria', compatibilityPct: 9.13 },
            { externalName: 'Da Qiao', compatibilityPct: 5.07 },
            { externalName: 'Shi', compatibilityPct: 2.66 },
            { heroId: 'dyadia', compatibilityPct: 2.56 },
            { externalName: 'Sakeer', compatibilityPct: 1.88 }
          ],
          trio: [
            { externalNames: ['Menki', 'Yaria'], compatibilityPct: 13.16 },
            { externalNames: ['Wang Zhaojun', 'Yaria'], compatibilityPct: 12.53 },
            { externalNames: ['Musashi', 'Yaria'], compatibilityPct: 12.26 },
            { externalNames: ['Yaria', 'Shi'], compatibilityPct: 11.11 },
            { externalNames: ['Musashi', 'Da Qiao'], compatibilityPct: 8.04 },
            { externalNames: ['Shi', 'Jing'], compatibilityPct: 7.72 },
            { externalNames: ['Yixing', 'Yaria'], compatibilityPct: 7.01 },
            { externalNames: ['Xuance', 'Yaria'], compatibilityPct: 6.72 },
            { externalNames: ['Da Qiao', 'Yao'], compatibilityPct: 3.83 }
          ]
        },

        teamNeeds: {
          needs: [
            'Frontline/peel agar Arli bisa fokus DPS dan tidak dipaksa buang Parasol untuk survive.',
            'Vision & kontrol area supaya Arli bisa set Parasol anchor tanpa kena flank/diver.',
            'CC/zone dari tim untuk menjaga lawan tetap di area Maple detonation + DPS window.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Hard CC + burst saat Arli commit masuk range atau saat window teleport habis.',
            'Diver/gapclose yang bisa nempel terus dan memaksa Arli teleport defensif.',
            'Damage/ancaman yang bukan projectile (karena Skill 2 hanya destroy projectile, bukan semua damage).'
          ]
        },

        needsValidation: {
          questions: [
            'Autumn Storm: range/width (unit) dan konfirmasi model knockback (push-to-line-end).',
            'Maple: radius ledakan (unit) dan radius apply stack dari ledakan (unit).',
            'Parasol: kurva scaling MS (30–60) dan AS (10–20%) per level (angka per level).'
          ]
        }
      }
    },
    {
      id: 'yaria',
      name: 'Yaria',
      role: 'Roaming',
      secondaryRoles: [],

      tags: ['support', 'buff', 'ranged'],

      image: 'images/heroes/yaria.png',

      profile: {
        type: 'Support',
        subtype: 'Support Buff',
        uniqueness: ['Buff Tim'],
        power: 'Seimbang (Early, Mid, Late Game)',
        lane: 'Roaming'
      },

      skills: {
        passive: {
          name: 'Deer Spirit',
          categories: ['immunity', 'slow', 'cleanse', 'cooldown_reset', 'untargetable', 'transform'],
          rawDescription: 'Skill Pasif: Deer Spirit (Kekebalan, Slow)\nSaat terpengaruh CC kuat (Kecuali Suppress), Yaria langsung menghapus semua CC dari dirinya dan berubah menjadi Deer Spirit selama 4 Detik. Saat dalam bentuk Deer Spirit, dia mendapat Skill baru, dan CD semua Skill miliknya direset. Selama rentang waktu ini, dia tidak bisa menggunakan Serangan Dasar atau ditarget, dan musuh di sekitar terkena Slow sebesar 15%. (Efek ini memiliki CD 60-48 Detik (bergantung level hero))',
          mechanics: {
            trigger: {
              when: 'hard_cc_received',
              excludes: ['suppress'],
              notes: ['Hard CC mencakup CC yang mengunci/menahan gerak (mis. stun/root/launch/knockback/pull), sesuai definisi user.']
            },

            onTrigger: {
              removeCrowdControl: {
                removesAll: true,
                notes: ['Cleanse instan saat pasif aktif (kecuali suppress tidak memicu).']
              },
              transform: {
                formName: 'Deer Spirit',
                durationSec: 4,
                untargetable: true,
                disablesBasicAttack: true,
                notes: ['Selama Deer Spirit, Yaria tidak bisa ditarget dan tidak bisa melakukan basic attack.']
              },
              cooldownReset: {
                targets: 'all_skills',
                notes: ['Semua cooldown skill di-reset saat masuk Deer Spirit.']
              },
              aura: {
                affects: 'enemies',
                effect: 'slow',
                slowPct: 15,
                area: {
                  type: 'circle',
                  radius: 'unknown'
                },
                notes: ['Slow aura aktif selama bentuk Deer Spirit. Radius belum dicatat.']
              },
              grantsNewSkill: {
                enabled: true,
                notes: ['Selama Deer Spirit, Yaria mendapatkan skill baru (akan dimodelkan setelah skill terkait diinput).']
              }
            },

            cooldownSec: {
              max: 60,
              min: 48,
              scalesWithLevel: true,
              notes: ['User konfirmasi cooldown turun mengikuti level hero; kurva scaling belum dicatat.']
            },

            needsValidation: {
              questions: [
                'Radius slow aura 15% saat Deer Spirit (unit).',
                'Apakah Deer Spirit bisa dipicu saat Yaria terkena chain hard CC (mis. stun lalu launch), dan apakah ada internal cooldown pada trigger saat status aktif.'
              ]
            }
          }
        },

        skill1: {
          name: 'Wandering Beam',
          cdSec: 10,
          manaCost: 50,
          categories: ['cc', 'magic', 'damage', 'vision', 'knockback', 'launch', 'skillshot'],
          rawDescription: 'Skill 1: Wandering Beam (CC, Damage Magis, Vision) (CD 10 Detik) Konsumsi Mana 50\nYaria mengarahkan sebuah jiwa dengan tongkatnya, menimbulkan 250 (250+30% Serangan Magis) Damage Magis pada musuh yang terhantam dan membuat mereka terpukul mundur. Setelah mencapai jangkauan maksimumnya, jiwa itu akan mengejar Hero musuh terdekat, menimbulkan 250 (250+30% Serangan Magis) Damage Magis, Launch selama 0,5 Detik, serta memperlihatkan Hero tersebut selama 5 Detik.\nDeer Spirit Form: Deer Spirit Form akan langsung berakhir.',
          mechanics: {
            delivery: 'skillshot_line',
            projectile: {
              pierce: true,
              bodyBlockByUnits: false,
              hits: {
                targets: ['hero', 'minion', 'monster'],
                damage: {
                  magic: { baseDamage: 250, bonusMagicAttackPct: 30 }
                },
                crowdControl: {
                  effect: 'knockback',
                  distance: 'short',
                  notes: ['Knockback pendek (untuk peel).']
                }
              },
              range: 'unknown',
              notes: ['Proyektil tetap meluncur hingga max range dan bisa mengenai beberapa unit di jalur.']
            },

            onMaxRange: {
              homing: {
                target: 'nearest_enemy_hero',
                from: 'projectile_end_position',
                damage: {
                  magic: { baseDamage: 250, bonusMagicAttackPct: 30 }
                },
                crowdControl: {
                  effect: 'launch',
                  durationSec: 0.5
                },
                reveal: {
                  durationSec: 5,
                  notes: ['Memperlihatkan target (vision) selama 5 detik.']
                },
                notes: ['Fase 2 selalu terjadi setelah proyektil mencapai max range; hanya mencari target hero.']
              }
            },

            deerSpiritInteraction: {
              endsDeerSpiritFormOnCast: true,
              notes: ['Jika digunakan saat Deer Spirit aktif, form langsung berakhir.']
            },

            needsValidation: {
              questions: [
                'Range max projectile (unit) dan kecepatan proyektil.',
                'Apakah ada limit jumlah hit/target pada lintasan (pierce cap).'
              ]
            }
          }
        },

        skill2: {
          name: 'Accelerating Blitz',
          cdSec: 12,
          manaCost: 50,
          categories: ['magic', 'damage', 'multi_hit', 'auto_target', 'duration'],
          rawDescription: 'Skill 2: Accelerating Blitz (Damage Magis) (CD 12 Detik) Konsumsi Mana 50\nYaria menimbulkan 200 (200+30% Serangan Magis) Damage Magis pada 3 musuh terdekat secara acak dalam 5 Detik, dengan Hero sebagai target prioritas. Dia tidak bisa menggunakan Serangan Dasar selama Skill ini aktif.\nDeer Spirit Form: Melompat ke depan.',
          mechanics: {
            normalForm: {
              durationSec: 5,
              tickIntervalSec: 1,
              hitsPerTick: 3,
              targeting: {
                targetPool: 'nearest_enemies_in_range',
                selection: 'random',
                heroPriority: true,
                allowsRepeatTargetsAcrossTicks: true,
                notes: ['User: tiap detik, pilih 3 musuh terdekat secara acak; hero diprioritaskan. Target bisa terkena lebih dari sekali selama durasi.']
              },
              hit: {
                damage: {
                  magic: { baseDamage: 200, bonusMagicAttackPct: 30 }
                }
              },
              disablesBasicAttack: true,
              notes: ['Selama skill aktif (5 detik), Yaria tidak bisa basic attack.']
            },

            deerSpiritForm: {
              delivery: 'point_dash',
              dash: {
                range: 'short',
                canPassThinWalls: true
              },
              endsDeerSpiritFormOnCast: false,
              notes: ['Saat dalam Deer Spirit, Skill 2 berubah menjadi lompatan ke depan; tidak mengakhiri Deer Spirit.']
            },

            needsValidation: {
              questions: [
                'Radius/area valid untuk "nearest enemies" pada Accelerating Blitz.',
                'Apakah satu target bisa menerima lebih dari 1 hit dalam tick yang sama (duplicate target dalam 1 interval).'
              ]
            }
          }
        },

        skill3: {
          name: 'Verdant Protector',
          cdSec: 15,
          manaCost: 50,
          categories: ['shield', 'enhance', 'utility', 'attach', 'untargetable', 'movement', 'cooldown_cut'],
          rawDescription: 'Skill 3: Verdant Protector (Shield, Tingkatkan) (CD 15 Detik) Konsumsi Mana 50\nMenempelkan diri pada seorang rekan tim, memberikan Shield yang menangkal 1000 (1000+60% Serangan Magis + 8% HP ekstra target) True Damage. Dia akan melepaskan diri saat Shield habis atau saat dia melompat ke arah yang ditentukan untuk melepaskan diri. Selama menempel, dia menjadi tidak bisa ditarget dan tidak bisa menggunakan Serangan Dasar. Menempel ke Hero akan langsung mengurangi CD Skill Aktifnya sebesar 30%, dan memberikan efek tambahan berikut:\nSkill 1: Jangkauan Soul Tracking bertambah 20%\nSkill 2: Jangkauan serangan bertambah 20%\nUltimate: Melepaskan diri secara manual (Detach) akan mempersingkat CD Ultimate sebesar 50%\nBentuk Deer Spirit: Area efek aura Slow akan meluas.',
          mechanics: {
            delivery: 'attach_ally_hero',
            attach: {
              target: 'ally_hero',
              becomesUntargetable: true,
              disablesBasicAttack: true,
              canCastWhileAttached: ['skill1', 'skill2'],
              castOriginWhileAttached: 'host',
              detach: {
                auto: {
                  whenShieldDepleted: true
                },
                manual: {
                  delivery: 'point_dash',
                  dash: {
                    range: 'short',
                    canPassThinWalls: true
                  },
                  notes: ['Manual detach adalah leap/dash murni (tanpa damage/CC).']
                }
              },
              notes: [
                'Attach hanya ke allied hero.',
                'Saat attach, Yaria tetap bisa cast Skill 1/2; origin cast dari posisi host.'
              ]
            },

            shield: {
              amount: {
                flat: 1000,
                bonusMagicAttackPct: 60,
                bonusTargetBonusHpPct: 8
              },
              absorbsTrueDamage: true,
              durationSec: null,
              notes: [
                'Scaling HP dihitung dari bonus/extra HP target (bukan total).',
                'Shield bisa menyerap semua tipe damage termasuk true (special-case: menyerap true damage).',
                'Shield tidak punya durasi; hanya habis saat shield depleted.'
              ]
            },

            onAttachToHero: {
              cooldownReductionPct: 30,
              skills: ['skill1', 'skill2'],
              notes: ['Saat attach ke hero, langsung mengurangi remaining cooldown Skill 1 & 2 sebesar 30%.']
            },

            whileAttachedBuffs: {
              skill1: {
                soulTrackingRangeBonusPct: 20
              },
              skill2: {
                targetSelectionRadiusBonusPct: 20,
                notes: ['+20% mempengaruhi radius pencarian target (nearest enemies) untuk Accelerating Blitz.']
              }
            },

            cooldownBehavior: {
              startsOnDetach: true,
              manualDetachCooldownMultiplier: 0.5,
              notes: [
                'Saat attach, tombol Ultimate berfungsi sebagai detach (tidak sedang cooldown).',
                'Setelah detach, cooldown dimulai; jika detach manual, cooldown ultimate dipersingkat 50%.'
              ]
            },

            deerSpiritInteraction: {
              slowAuraAreaIncreases: true,
              notes: ['Saat Deer Spirit aktif, area aura slow meluas (angka radius belum dicatat).']
            },

            needsValidation: {
              questions: [
                'Radius/us/skalkalanya perluasan aura slow saat Deer Spirit.',
                'Radius/area valid untuk pencntuk Skill 2 mempengaruhi radius pencarian target (nearest enemies) atau radius maksimum seleksi (bisa beda istilah).',
                'Apakah shield memiliki durasi maksimum terlepas dari damage (timeout) atau hanya habis saat shield depleted.'
              ]
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 165, base: 165, bonus: 0 },
          magicAttack: { total: 0, base: 0, bonus: 0 },
          maxHP: 2913,
          maxMana: 620,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 365,
          hpRegenPer5s: 36,
          manaRegenPer5s: 15,
          attackRange: 'Ranged'
        },

        level15: {
          physicalAttack: { total: 309, base: 309, bonus: 0 },
          magicAttack: { total: 0, base: 0, bonus: 0 },
          maxHP: 5574,
          maxMana: 1240,
          physicalDefense: { value: 381 },
          magicDefense: { value: 212 },
          attackSpeedBonusPct: 19,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 365,
          hpRegenPer5s: 64,
          manaRegenPer5s: 30,
          attackRange: 'Ranged'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Protective Attach Support',
          playPattern: 'Attach ke core ally untuk deny burst (termasuk true damage) lalu cast Skill 1/2 dari posisi host untuk peel/pick.',
          engageRole: 'secondary',
          notes: [
            'Win condition: menjaga 1 target prioritas tetap hidup lewat Verdant Protector + window untargetable + Deer Spirit reset.',
            'Bisa mengubah tempo fight dengan detach dash (thin wall) dan re-attach ulang saat cooldown tersedia.'
          ]
        },

        powerCurve: {
          early: 'medium',
          mid: 'high',
          late: 'high',
          notes: [
            'Value meningkat saat ally target stacking bonus HP (shield scale dari bonus HP target).',
            'Late game: deny burst/execute termasuk true damage jadi semakin relevan.'
          ]
        },

        draftValues: {
          mobility: 'high',
          frontline: 'low',
          sustain: 'medium',

          engage: 'low',
          disengage: 'high',
          peel: 'high',

          cc: 'medium',
          pickPotential: 'medium',

          burst: 'low',
          dps: 'low'
        },

        crowdControl: [
          {
            source: 'passive',
            effect: 'slow',
            delivery: 'aoe_self',
            reliability: 'low',
            durationSec: 4,
            notes: [
              'Saat Deer Spirit aktif (trigger hard CC kecuali suppress), aura slow 15% ke musuh sekitar.',
              'Reliability rendah karena kondisional (butuh hard CC); radius belum dicatat.'
            ]
          },
          {
            source: 'skill1',
            effect: 'knockback',
            delivery: 'skillshot_line',
            reliability: 'medium',
            notes: ['Knockback pendek pada unit yang terkena di jalur proyektil.']
          },
          {
            source: 'skill1',
            effect: 'launch',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 0.5,
            notes: ['Fase 2: homing ke nearest enemy hero dari titik akhir proyektil + launch 0,5s + reveal 5s.']
          }
        ],

        mobilityProfile: {
          level: 'high',
          uses: ['reposition', 'escape'],
          notes: [
            'Skill 3: attach membuat Yaria untargetable dan mengikuti pergerakan host; detach manual berupa dash pendek yang bisa menembus thin wall.',
            'Deer Spirit: Skill 2 menjadi leap pendek tembus thin wall untuk reposition saat window pasif aktif.'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [
            { heroId: 'marco_polo', compatibilityPct: 25.01 },
            { heroId: 'arli', compatibilityPct: 9.13 },
            { externalName: 'Butterfly', compatibilityPct: 3.74 },
            { externalName: 'Lady Zhen', compatibilityPct: 2.76 },
            { externalName: 'Menki', compatibilityPct: 2.58 },
            { externalName: 'Diaochan', compatibilityPct: 2.42 },
            { externalName: 'Lam', compatibilityPct: 2.38 },
            { externalName: 'Xuance', compatibilityPct: 1.90 },
            { externalName: 'Li Bai', compatibilityPct: 1.78 },
            { externalName: 'Cirrus', compatibilityPct: 1.67 },
            { heroId: 'ying', compatibilityPct: 1.60 },
            { externalName: 'Han Xin', compatibilityPct: 1.58 }
          ],
          trio: [
            { externalNames: ['Lady Zhen', 'Marco Polo'], compatibilityPct: 29.82 },
            { externalNames: ['Marco Polo', 'Luna'], compatibilityPct: 29.62 },
            { externalNames: ['Marco Polo', 'Lam'], compatibilityPct: 28.87 },
            { externalNames: ['Marco Polo', 'Diaochan'], compatibilityPct: 19.02 },
            { externalNames: ['Marco Polo', 'Wang Zhaojun'], compatibilityPct: 18.83 },
            { externalNames: ['Li Bai', 'Marco Polo'], compatibilityPct: 18.69 },
            { heroIds: ['marco_polo', 'ying'], compatibilityPct: 18.69 },
            { externalNames: ['Marco Polo', 'Cirrus'], compatibilityPct: 18.63 },
            { externalNames: ['Marco Polo', 'Han Xin'], compatibilityPct: 18.62 },
            { externalNames: ['Menki', 'Arli'], compatibilityPct: 13.16 },
            { externalNames: ['Wang Zhaojun', 'Arli'], compatibilityPct: 12.53 },
            { heroIds: ['musashi', 'arli'], compatibilityPct: 12.26 },
            { externalNames: ['Arli', 'Shi'], compatibilityPct: 11.11 },
            { externalNames: ['Yixing', 'Arli'], compatibilityPct: 7.01 },
            { externalNames: ['Xuance', 'Arli'], compatibilityPct: 6.72 },
            { externalNames: ['Lady Zhen', 'Lam'], compatibilityPct: 6.63 },
            { externalNames: ['Luna', 'Mulan'], compatibilityPct: 4.23 },
            { externalNames: ['Lady Zhen', 'Han Xin'], compatibilityPct: 3.78 },
            { externalNames: ['Nuwa', 'Nezha'], compatibilityPct: 2.94 }
          ]
        },

        teamNeeds: {
          needs: [
            '1 win condition yang jelas untuk ditempeli (carry/diver); paling optimal pada hero yang build bonus HP (shield scaling).',
            'Frontline/space agar attach tidak dipaksa lepas terlalu cepat (shield cepat habis).',
            'Follow-up cepat saat Skill 1 fase 2 connect (launch 0,5s + reveal) untuk konversi menjadi pick.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Suppression (pasif Deer Spirit tidak memicu) untuk mengunci/mengeksekusi target attach tanpa memberi window reset.',
            'Damage beruntun/DoT untuk menghabiskan shield lebih cepat sebelum value deny burst terasa.',
            'Disengage/spacing untuk mengurangi peluang Skill 1 fase 2 mendapat target prioritas.'
          ]
        },

        needsValidation: {
          questions: [
            'Radius slow aura Deer Spirit (unit) dan berapa besar peningkatan area saat interaksi Deer Spirit pada Skill 3.',
            'Radius/area valid untuk pencarian target Accelerating Blitz (base dan +20%).'
          ]
        }
      }
    },
    {
      id: 'ukyo_tachibana',
      name: 'Ukyo Tachibana',
      shortName: 'Ukyo',
      role: 'Jungling',
      secondaryRoles: ['Clash Lane'],

      tags: ['assassin', 'fighter', 'early_game', 'nimble', 'mobility', 'melee', 'physical', 'recovery', 'slow', 'dash', 'reposition', 'execute', 'cooldown_acceleration', 'cooldown_cut', 'multi_hit', 'recast'],


      image: 'images/heroes/ukyo_tachibana.png',

      profile: {
        traits: ['Early Game', 'Recovery'],
        type: 'Assassin/Fighter',
        subtype: 'Duelist Skirmisher',
        uniqueness: ['Mendekati', 'Recovery'],
        power: 'Early Game',
        lane: 'Jungling',
        sub: 'Clash Lane'
      },

      skills: {
        passive: {
          name: 'Oboro Gatana',
          categories: ['enhance', 'physical', 'recovery', 'slow', 'cooldown_acceleration'],
          rawDescription: 'Skill Pasif: Oboro Gatana (Tingkatkan, Damage Fisik, Pemulihan)\nUkyo meningkatkan Serangan Dasar berikutnya menjadi Quick Draw (cooldown 5-4 detik, berkurang sesuai level). Quick Draw menimbulkan 40/80 (40/80 + 35% Serangan Fisik ekstra) Damage Fisik, memulihkan 125/250 (125/250 + 2% HP ekstra) HP, dan memperlambat target sebesar 15-30% selama 2 detik.\nJika mengenai musuh di ujung jangkauan, Quick Draw menimbulkan tambahan 80/160 (80/160 + 70% Serangan Fisik ekstra) Damage Fisik.\nSaat menimbulkan Damage menggunakan Skill, cooldown pasif ini dipersingkat 0,5 detik.',
          mechanics: {
            energyMeter: {
              represents: 'passive_cooldown',
              maxEnergy: { level1: 1050, level15: 840 },
              cooldownSec: { max: 5, min: 4, scalesWithLevel: true },
              notes: [
                'Energy bukan resource yang dihabiskan; ini meter yang terisi sampai penuh. Saat penuh, pasif siap (enhanced basic).',
                'Max energy yang lebih kecil membuat meter lebih cepat penuh di late game.'
              ]
            },

            enhancedBasicAttack: {
              name: 'Quick Draw',
              countsAsBasicAttack: true,
              damage: {
                physical: {
                  baseDamageByLevel: { level1: 40, level15: 80 },
                  bonusPhysicalAttackPct: 35
                }
              },
              healing: {
                flatByLevel: { level1: 125, level15: 250 },
                bonusHpPct: 2
              },
              slow: {
                slowPctByLevel: { min: 15, max: 30 },
                durationSec: 2
              },
              edgeBonusDamage: {
                physical: {
                  baseDamageByLevel: { level1: 80, level15: 160 },
                  bonusPhysicalAttackPct: 70
                },
                nonHeroMultiplier: 0.5,
                notes: [
                  'Non-hero clause diasumsikan merujuk ke bonus edge; butuh validasi.'
                ]
              }
            },

            cooldownAccelerationOnSkillDamage: {
              reductionSecPerHit: 0.5,
              trigger: 'skill_damage_instance',
              countsAsOnePerHitEvenIfMultiTarget: true,
              countsNonHeroes: true,
              notes: [
                'Terverifikasi: multi-hit skill memotong beberapa kali (per hit instance), tetapi 1 hit yang mengenai beberapa unit tetap dihitung 1x.'
              ]
            }
          }
        },

        skill1: {
          name: 'Tsubame Gaeshi',
          cdSec: 7,
          manaCost: 0,
          categories: ['movement', 'physical', 'recast', 'dash', 'reposition', 'cooldown_cut', 'execute'],
          rawDescription: 'Skill 1: TSUBAME GAESHI (Gerakan, Damage Fisik)(CD: 7/6,7/6,4/6,1/5,8/5,5 Detik)\nUkyo Tachibana melompat ke belakang sambil menebas musuh yang dilewatinya, menimbulkan 330 (330/396/462/528/594/660 + 150% Serangan Fisik ekstra) Damage Fisik dan mengaktifkan fase kedua dari Skill ini. Jika tak ada unit musuh yang terkena tebasan, fase kedua akan aktif setelah 2 Detik.\nJika setelah menggunakan fase 2 dia kembali ke dekat posisi tempatnya memulai fase 1, fase kedua akan ditingkatkan. Saat ditingkatkan, jangkauan tebasannya akan bertambah dan untuk setiap Hero musuh yang terkena tebasan, CD Ultimate akan berkurang 1 Detik (Hanya setengahnya untuk Unit Non-Hero).\nUntuk setiap 2% HP yang hilang dari Target, Damage Skill ini bertambah 1%',
          mechanics: {
            cooldownSecBySkillLevel: [7, 6.7, 6.4, 6.1, 5.8, 5.5],

            phase1: {
              movement: { type: 'back_leap' },
              damage: {
                physical: {
                  baseDamageBySkillLevel: [330, 396, 462, 528, 594, 660],
                  bonusPhysicalAttackPct: 150
                }
              },
              enablesPhase2: true,
              phase2DelayIfMissSec: 2
            },

            phase2: {
              delivery: 'recast',
              manual: true,
              notes: [
                'Fase 2 dicast manual. Input arah terasa "terbalik" (aim untuk positioning balik ke origin fase 1 agar mendapat upgrade).',
                'Damage fase 2 belum dikonfirmasi apakah sama dengan fase 1 atau berbeda.'
              ]
            },

            phase2Upgrade: {
              condition: 'ends_near_phase1_origin',
              effects: {
                rangeIncreases: true,
                ultimateCooldownReductionOnHit: {
                  perEnemyHeroHitSec: 1,
                  nonHeroMultiplier: 0.5
                }
              }
            },

            missingHpExecuteScaling: {
              damageBonusPctPerMissingTargetHpPct: 0.5,
              notes: ['+1% damage per 2% HP target yang hilang.']
            }
          }
        },

        skill2: {
          name: 'Kami Okuri',
          cdSec: 10,
          manaCost: 0,
          categories: ['physical', 'cc', 'stun'],
          rawDescription: 'Skill 2: KAMI OKURI (Damage Fisik, CC)(CD 10/9,5/9/8,5/8/7,5 Detik)\nUkyo Tachibana menebas kearah target, menimbulkan 580 (580/696/812/928/1044/1160+190% Serangan Fisik ekstra) Damage Fisik pada musuh dalam jangkauan. Musuh yang di tepi area jangkauan akan terkena Stun selama 0,75 Detik.',
          mechanics: {
            delivery: 'skillshot_line',
            cooldownSecBySkillLevel: [10, 9.5, 9, 8.5, 8, 7.5],
            damage: {
              physical: {
                baseDamageBySkillLevel: [580, 696, 812, 928, 1044, 1160],
                bonusPhysicalAttackPct: 190
              }
            },
            crowdControl: {
              effect: 'stun',
              durationSec: 0.75,
              condition: 'target_in_outer_edge_band',
              appliesTo: ['hero', 'minion', 'monster'],
              canAffectMultipleTargetsPerCast: true,
              notes: [
                'Stun hanya terjadi jika unit berada di strip tepi (outer boundary band) sesuai indikator area.'
              ]
            },
            needsValidation: {
              questions: ['Ketebalan strip tepi (outer boundary band) Kami Okuri (unit) belum dicatat.']
            }
          }
        },

        skill3: {
          name: 'Sasameyuki',
          cdSec: 12.5,
          manaCost: 0,
          categories: ['physical', 'recovery', 'enhance', 'multi_hit', 'skillshot_cone'],
          rawDescription: 'Skill 3: SASAMEYUKI (Damage Fisik, Recovery)(CD 12,5/11,2/10 Detik)\nUkyo Tachibana menebas 4 kali dengan cepat ke arah yang ditentukan, masing-masing menimbulkan 210 (210/315/420+65% Serangan Fisik ekstra) Damage Fisik pada musuh dalam jangkauan. Setiap tebasan yang menghantam Hero musuh memulihkan 300 (300/450/600+4,5% HP ekstra) HP miliknya. Efek ini hanya setengahnya jika tebasan hanya menghantam unit Non-Hero.',
          mechanics: {
            delivery: 'skillshot_cone',
            aimLockedOnCast: true,
            cooldownSecBySkillLevel: [12.5, 11.2, 10],
            hits: 4,
            hitIntervalSec: 0.25,
            totalDurationSec: 1,
            validTargets: ['hero', 'minion', 'monster'],
            notes: ['Tidak mengenai tower; objective seperti Dragon dihitung monster.'],
            damage: {
              physical: {
                baseDamageBySkillLevel: [210, 315, 420],
                bonusPhysicalAttackPct: 65,
                perHit: true
              }
            },
            healing: {
              trigger: 'per_hit',
              flatBySkillLevel: [300, 450, 600],
              bonusHpPct: 4.5,
              nonHeroOnlyMultiplier: 0.5,
              appliesTo: ['self'],
              notes: [
                'Heal dihitung per tebasan.',
                'Jika satu tebasan hanya mengenai non-hero, heal tebasan itu hanya 50%. Jika tebasan mengenai hero (meski juga mengenai non-hero), heal full.'
              ]
            }
          }
        }
      },

      stats: {
        level1: {
          physicalAttack: { total: 180, base: 170, bonus: 10 },
          maxHP: 3250,
          maxMana: 1050,
          physicalDefense: { value: 150 },
          magicDefense: { value: 75 },
          attackSpeedBonusPct: 5,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 385,
          hpRegenPer5s: 48,
          manaRegenPer5s: 0,
          attackRange: 'Melee'
        },

        level15: {
          physicalAttack: { total: 363, base: 353, bonus: 10 },
          maxHP: 7070,
          maxMana: 840,
          physicalDefense: { value: 388 },
          magicDefense: { value: 166 },
          attackSpeedBonusPct: 26,
          criticalRatePct: 0,
          criticalDamagePct: 200,
          moveSpeed: 385,
          hpRegenPer5s: 92,
          manaRegenPer5s: 0,
          attackRange: 'Melee'
        }
      },

      coachProfile: {
        draftIdentity: {
          archetype: 'Assassin/Fighter',
          engageRole: 'secondary',
          playPattern: 'Early-game skirmish jungler: cari duel/river fight, pakai Skill 1 (recast) untuk reposition & chase, Skill 2 untuk pick via edge-stun, lalu commit Skill 3 (4-hit) untuk burst + sustain. Menang lewat tempo (trade menang lalu konversi jadi objective).',
          notes: [
            'Win condition: snowball dari skirmish awal + pick pendek (edge stun) lalu konversi ke objective.',
            'Counterplay utama musuh adalah spacing (hindari edge band Skill 2) dan kite keluar cone Skill 3 saat Ukyo commit stationary.'
          ]
        },

        powerCurve: {
          early: 'high',
          mid: 'medium',
          late: 'medium',
          notes: [
            'Early kuat karena burst tinggi + sustain (pasif + Skill 3) dan mobility dari Skill 1.',
            'Late tidak setinggi assassin hard-scaler; tetap relevan untuk pick/cleanup bila dapat angle.'
          ]
        },

        draftValues: {
          mobility: 'high',
          frontline: 'low',
          sustain: 'high',

          engage: 'medium',
          disengage: 'medium',
          peel: 'low',

          cc: 'medium',
          pickPotential: 'medium',

          burst: 'high',
          dps: 'medium'
        },

        crowdControl: [
          {
            source: 'passive',
            effect: 'slow',
            delivery: 'targeted_melee',
            reliability: 'high',
            durationSec: 2,
            notes: ['Slow dari enhanced basic Quick Draw (15–30% scaling sesuai level).']
          },
          {
            source: 'skill2',
            effect: 'stun',
            delivery: 'skillshot_line',
            reliability: 'medium',
            durationSec: 0.75,
            notes: [
              'Stun hanya jika target berada di strip tepi (outer boundary band).',
              'Bisa multi-target, berlaku juga ke non-hero.'
            ]
          }
        ],

        mobilityProfile: {
          level: 'high',
          uses: ['engage', 'chase', 'reposition', 'escape'],
          notes: [
            'Skill 1 punya back-leap + recast reposition; bisa dipakai untuk masuk/keluar fight atau ngejar.',
            'Lebih cocok follow-up/pick daripada initiator utama karena hard CC-nya kondisional (edge stun).'
          ]
        },

        synergy: {
          source: {
            name: 'hok_official',
            metric: 'compatibility',
            notes: [
              'Kompatibilitas mencerminkan kemampuan hero dalam kombinasi untuk mengimbangi kekurangan satu sama lain dan meningkatkan keunggulan mereka.',
              'Makin tinggi kompatibilitas, makin baik koordinasi hero dalam kombinasi ini.'
            ]
          },
          duo: [{ heroId: 'liu_shan', compatibilityPct: 1.16 }],
          trio: [
            { externalNames: ['Liu Shan', 'Milady'], compatibilityPct: 3.32 },
            { externalNames: ['Liu Shan', 'Erin'], compatibilityPct: 2.89 }
          ]
        },

        teamNeeds: {
          needs: [
            'Tempo team yang mau fight early (river/invade) untuk snowball.',
            'Vision/CC setup dari tim agar Ukyo bisa mengamankan angle edge-stun atau commit Skill 3 dengan aman.',
            'Frontline/space supaya Ukyo tidak dipaksa commit sendirian saat masuk.'
          ]
        },

        counterplay: {
          counteredBy: [
            'Hard CC instan saat Ukyo commit (terutama saat Skill 3 karena stationary ~1 detik).',
            'Anti-heal / burst cepat untuk meniadakan value sustain dari pasif + Skill 3.',
            'Kiting & spacing: keluar dari cone Skill 3 dan hindari outer-edge band Skill 2.'
          ]
        },

        needsValidation: {
          questions: [
            'Validasi apakah klausa "Unit non-Hero hanya menerima setengah Damage" pada pasif merujuk ke bonus edge atau termasuk damage utama Quick Draw.',
            'Konfirmasi apakah damage fase 2 Tsubame Gaeshi berbeda dengan fase 1 atau menggunakan formula yang sama.',
            'Konfirmasi ambang/radius "kembali dekat posisi awal fase 1" yang memicu upgrade fase 2.',
            'Ketebalan strip tepi (outer boundary band) Kami Okuri (unit) belum dicatat.'
          ]
        }
      }
    }
  ];
})();
