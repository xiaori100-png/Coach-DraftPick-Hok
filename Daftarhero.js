(function () {
  'use strict';

  // Internal keys use English for simplicity; UI labels are Indonesian.
  var TEAM_KEYS = ['ally', 'enemy'];
  var TEAM_LABELS = {
    ally: 'Tim Kita',
    enemy: 'Tim Musuh'
  };

  // Pattern 1-2-2-2-2-1 relatif terhadap First Pick.
  // 0 = First Pick team, 1 = other team.
  var AUTO_DRAFT_PATTERN = [0, 1, 1, 0, 0, 1, 1, 0, 0, 1];

  function oppositeTeam(teamKey) {
    return teamKey === 'enemy' ? 'ally' : 'enemy';
  }

  // Requested HoK lane roles.
  var LANE_ROLES = ['Clash Lane', 'Farm Lane', 'Mid Lane', 'Jungling', 'Roaming'];
  var LANE_CODES = {
    'Clash Lane': 'CL',
    'Mid Lane': 'ML',
    'Farm Lane': 'FL',
    'Jungling': 'JL',
    'Roaming': 'RM'
  };

  var REC_TAB_SMART = 'Smart';

  /**
   * Hero schema (placeholder until you input all HoK heroes):
   * {
   *   id: string,
   *   name: string,
   *   role: 'Clash Lane'|'Farm Lane'|'Mid Lane'|'Jungling'|'Roaming',
   *   tags: string[], // e.g. ['tank','frontline','cc','magic'|'physical']
   *   image: string   // you can later point to: images/heroes/<id>.png
   * }
   */
  var HEROES = (window.DatabaseHero && Array.isArray(window.DatabaseHero.HEROES)) ? window.DatabaseHero.HEROES : [];

  function uniq(arr) {
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      if (out.indexOf(arr[i]) === -1) out.push(arr[i]);
    }
    return out;
  }

  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'className') node.className = attrs[key];
        else if (key === 'text') node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key]);
      });
    }
    return node;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function containsIgnoreCase(haystack, needle) {
    return String(haystack || '').toLowerCase().indexOf(String(needle || '').toLowerCase()) !== -1;
  }

  function normalizeRole(role) {
    return String(role || '').trim();
  }

  function isValidRecTab(value) {
    return value === REC_TAB_SMART || LANE_ROLES.indexOf(value) !== -1;
  }

  function laneCode(lane) {
    var l = normalizeRole(lane);
    if (!l) return '--';
    return LANE_CODES[l] || '--';
  }

  function heroSecondaryRoles(hero) {
    if (!hero || !Array.isArray(hero.secondaryRoles)) return [];

    var out = [];
    for (var i = 0; i < hero.secondaryRoles.length; i++) {
      var r = normalizeRole(hero.secondaryRoles[i]);
      if (!r) continue;
      if (out.indexOf(r) === -1) out.push(r);
    }
    return out;
  }

  function heroCanPlayLane(hero, lane) {
    var l = normalizeRole(lane);
    if (!l) return false;

    if (normalizeRole(hero && hero.role) === l) return true;

    var secondary = heroSecondaryRoles(hero);
    return secondary.indexOf(l) !== -1;
  }

  function heroIsSecondaryLane(hero, lane) {
    var l = normalizeRole(lane);
    if (!l) return false;

    if (normalizeRole(hero && hero.role) === l) return false;

    var secondary = heroSecondaryRoles(hero);
    return secondary.indexOf(l) !== -1;
  }

  function compactReason(reason) {
    var r = String(reason || '');

    if (r.indexOf('Mengisi role kosong:') === 0) {
      return 'Isi ' + r.replace('Mengisi role kosong:', '').trim();
    }

    if (r.indexOf('Menambah opsi role:') === 0) {
      return 'Flex ' + r.replace('Menambah opsi role:', '').trim();
    }

    if (r.indexOf('First pick') === 0) {
      if (r.indexOf('frontline') !== -1) return 'Frontline';
      if (r.indexOf('CC') !== -1 || r.indexOf('crowd control') !== -1) return 'CC';
      if (r.indexOf('peel') !== -1 || r.indexOf('proteksi') !== -1) return 'Peel';
      if (r.indexOf('disengage') !== -1) return 'Disengage';
      if (r.indexOf('mobilitas') !== -1) return 'Mobility';
      if (r.indexOf('pick') !== -1) return 'Pick';
      if (r.indexOf('engage') !== -1) return 'Engage';
      if (r.toLowerCase().indexOf('burst') !== -1) return 'Burst';
      if (r.toLowerCase().indexOf('dps') !== -1) return 'DPS';
      if (r.toLowerCase().indexOf('sustain') !== -1) return 'Sustain';
      return 'First pick';
    }

    if (r.indexOf('Tempo early') === 0) return 'Early';
    if (r.indexOf('Butuh setup tim') === 0) return 'Setup';

    if (r.indexOf('Menambah tank/frontline') === 0) return 'Frontline';
    if (r.indexOf('Menambah crowd control') === 0) return 'CC';
    if (r.indexOf('Menambah primary engage') === 0) return 'Engage';
    if (r.indexOf('Menambah follow-up engage') === 0) return 'Follow engage';
    if (r.indexOf('Menambah pick potential') === 0) return 'Pick';
    if (r.indexOf('Menambah burst damage') === 0) return 'Burst';
    if (r.indexOf('Menambah DPS berkelanjutan') === 0) return 'DPS';
    if (r.indexOf('Menambah sustain') === 0) return 'Sustain';
    if (r.indexOf('Menambah peel') === 0) return 'Peel';
    if (r.indexOf('Menambah disengage') === 0) return 'Disengage';
    if (r.indexOf('Menambah damage magic') === 0) return 'Magic';
    if (r.indexOf('Menambah damage physical') === 0) return 'Physical';
    if (r.indexOf('Menyeimbangkan damage') === 0) return 'Balance';
    if (r.indexOf('Mendekatkan balance damage') === 0) return 'Balance';
    if (r.indexOf('Sinergi') === 0) return 'Sinergi';
    if (r.indexOf('Deny') === 0 || r.indexOf('Watchlist deny') === 0) return 'Deny';

    if (r.length > 22) return r.slice(0, 22) + '…';
    return r;
  }

  function ratingToNumber(value) {
    var v = String(value || '').toLowerCase();
    if (v === 'high') return 2;
    if (v === 'medium') return 1;
    if (v === 'low') return 0;
    return null;
  }

  function heroTags(hero) {
    return (hero && Array.isArray(hero.tags)) ? hero.tags : [];
  }

  function heroThumbBackground(imageUrl) {
    var overlay = "linear-gradient(135deg, rgba(246, 195, 67, 0.22), rgba(255, 122, 24, 0.18))";
    if (!imageUrl) return overlay;
    return overlay + ", url('" + imageUrl + "')";
  }

  function hasCoachProfile(hero) {
    return Boolean(hero && hero.coachProfile && hero.coachProfile.draftValues);
  }

  function getFrontlineRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.frontline);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('tank') !== -1 || tags.indexOf('frontline') !== -1) return 2;
    return null;
  }

  function getCCRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.cc);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('cc') !== -1 || tags.indexOf('control') !== -1) return 1;
    return null;
  }

  function getEngageRole(hero) {
    if (hero && hero.coachProfile && hero.coachProfile.draftIdentity && hero.coachProfile.draftIdentity.engageRole) {
      return hero.coachProfile.draftIdentity.engageRole;
    }

    var tags = heroTags(hero);
    if (tags.indexOf('engage') === -1) return null;

    // Heuristic fallback for heroes without coachProfile.
    if (tags.indexOf('tank') !== -1 || tags.indexOf('frontline') !== -1) return 'primary';
    return 'secondary';
  }

  function getEngageRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.engage);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('engage') !== -1) return 1;
    return null;
  }

  function getPickPotentialRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.pickPotential);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('pick') !== -1 || tags.indexOf('pick_potential') !== -1) return 2;
    if (tags.indexOf('cc') !== -1 || tags.indexOf('control') !== -1) return 1;
    return null;
  }

  function getBurstRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.burst);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('burst') !== -1) return 2;
    return null;
  }

  function getDpsRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.dps);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('dps') !== -1) return 2;
    return null;
  }

  function getSustainRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.sustain);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('heal') !== -1 || tags.indexOf('recovery') !== -1) return 2;
    if (tags.indexOf('sustain') !== -1) return 1;
    return null;
  }

  function getPeelRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.peel);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('peel') !== -1) return 2;
    if (tags.indexOf('disengage') !== -1 || tags.indexOf('cc') !== -1) return 1;
    return null;
  }

  function getDisengageRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.disengage);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('disengage') !== -1) return 1;
    return null;
  }

  function getMobilityRating(hero) {
    if (hasCoachProfile(hero)) {
      return ratingToNumber(hero.coachProfile.draftValues.mobility);
    }

    var tags = heroTags(hero);
    if (tags.indexOf('blink') !== -1 || tags.indexOf('dash') !== -1) return 2;
    if (tags.indexOf('mobility') !== -1) return 1;
    return null;
  }

  function getEarlyPowerRating(hero) {
    if (hero && hero.coachProfile && hero.coachProfile.powerCurve) {
      return ratingToNumber(hero.coachProfile.powerCurve.early);
    }
    return null;
  }

  function getTeamNeedsCount(hero) {
    if (hero && hero.coachProfile && hero.coachProfile.teamNeeds && Array.isArray(hero.coachProfile.teamNeeds.needs)) {
      return hero.coachProfile.teamNeeds.needs.length;
    }
    return 0;
  }

  var FIRST_PICK_WEIGHTS = {
    default: {
      frontline: 1,
      cc: 1,
      peel: 1,
      disengage: 1,
      mobility: 1,
      pickPotential: 1,
      engage: 1,
      burst: 1,
      dps: 1,
      sustain: 1,
      early: 1,
      setupPenalty: 1
    },
    'Roaming': {
      frontline: 1.35,
      cc: 1.25,
      peel: 1.2,
      disengage: 1,
      mobility: 0.85,
      pickPotential: 0.9,
      engage: 1.1,
      burst: 0.3,
      dps: 0.25,
      sustain: 0.9,
      early: 0.85,
      setupPenalty: 0.9
    },
    'Clash Lane': {
      frontline: 1.25,
      cc: 1.1,
      peel: 0.75,
      disengage: 0.9,
      mobility: 0.8,
      pickPotential: 0.7,
      engage: 1,
      burst: 0.7,
      dps: 0.75,
      sustain: 1.15,
      early: 0.95,
      setupPenalty: 0.95
    },
    'Jungling': {
      frontline: 0.35,
      cc: 0.8,
      peel: 0.3,
      disengage: 0.85,
      mobility: 1.35,
      pickPotential: 1.3,
      engage: 1,
      burst: 1.25,
      dps: 0.85,
      sustain: 0.65,
      early: 1.25,
      setupPenalty: 1.15
    },
    'Mid Lane': {
      frontline: 0.25,
      cc: 1.2,
      peel: 0.65,
      disengage: 0.85,
      mobility: 1.05,
      pickPotential: 1.2,
      engage: 0.8,
      burst: 1.15,
      dps: 0.75,
      sustain: 0.5,
      early: 1,
      setupPenalty: 1
    },
    'Farm Lane': {
      frontline: 0.2,
      cc: 0.75,
      peel: 0.9,
      disengage: 1.1,
      mobility: 1.05,
      pickPotential: 0.8,
      engage: 0.55,
      burst: 0.8,
      dps: 1.2,
      sustain: 0.85,
      early: 0.95,
      setupPenalty: 1
    }
  };

  function weightedPoints(points, weight) {
    return Math.round(points * weight);
  }

  function firstPickWeightsForLane(lane) {
    var key = normalizeRole(lane);
    return FIRST_PICK_WEIGHTS[key] || FIRST_PICK_WEIGHTS.default;
  }

  function scoreHeroForFirstPick(hero, laneContext) {
    var score = 0;
    var reasons = [];

    var lane = normalizeRole(laneContext) || normalizeRole(hero.role);
    var w = firstPickWeightsForLane(lane);

    var frontlineRating = getFrontlineRating(hero);
    if (frontlineRating !== null && frontlineRating >= 2) {
      score += weightedPoints(3, w.frontline);
      reasons.push('First pick aman: frontline');
    } else if (frontlineRating !== null && frontlineRating === 1) {
      score += weightedPoints(1, w.frontline);
      reasons.push('First pick: frontline cukup');
    }

    var ccRating = getCCRating(hero);
    if (ccRating !== null && ccRating >= 2) {
      score += weightedPoints(3, w.cc);
      reasons.push('First pick aman: CC kuat');
    } else if (ccRating !== null && ccRating >= 1) {
      score += weightedPoints(2, w.cc);
      reasons.push('First pick: punya CC');
    }

    var peelRating = getPeelRating(hero);
    if (peelRating !== null && peelRating >= 2) {
      score += weightedPoints(2, w.peel);
      reasons.push('First pick: peel/proteksi');
    } else if (peelRating !== null && peelRating >= 1) {
      score += weightedPoints(1, w.peel);
      reasons.push('First pick: peel');
    }

    var disengageRating = getDisengageRating(hero);
    if (disengageRating !== null && disengageRating >= 1) {
      score += weightedPoints(1, w.disengage);
      reasons.push('First pick: disengage');
    }

    var mobilityRating = getMobilityRating(hero);
    if (mobilityRating !== null && mobilityRating >= 2) {
      score += weightedPoints(2, w.mobility);
      reasons.push('First pick: mobilitas');
    } else if (mobilityRating !== null && mobilityRating >= 1) {
      score += weightedPoints(1, w.mobility);
      reasons.push('First pick: mobilitas');
    }

    var pickRating = getPickPotentialRating(hero);
    if (pickRating !== null && pickRating >= 1) {
      score += weightedPoints(1, w.pickPotential);
      reasons.push('First pick: pick tool');
    }

    var engageRole = getEngageRole(hero);
    var engageRating = getEngageRating(hero);
    if (engageRole === 'primary' && engageRating !== null && engageRating >= 1) {
      score += weightedPoints(1, w.engage);
      reasons.push('First pick: engage');
    }

    var burstRating = getBurstRating(hero);
    if (burstRating !== null && burstRating >= 2) {
      score += weightedPoints(2, w.burst);
      reasons.push('First pick: burst');
    } else if (burstRating !== null && burstRating >= 1) {
      score += weightedPoints(1, w.burst);
      reasons.push('First pick: burst');
    }

    var dpsRating = getDpsRating(hero);
    if (dpsRating !== null && dpsRating >= 2) {
      score += weightedPoints(2, w.dps);
      reasons.push('First pick: DPS');
    } else if (dpsRating !== null && dpsRating >= 1) {
      score += weightedPoints(1, w.dps);
      reasons.push('First pick: DPS');
    }

    var sustainRating = getSustainRating(hero);
    if (sustainRating !== null && sustainRating >= 2) {
      score += weightedPoints(2, w.sustain);
      reasons.push('First pick: sustain');
    } else if (sustainRating !== null && sustainRating >= 1) {
      score += weightedPoints(1, w.sustain);
      reasons.push('First pick: sustain');
    }

    var earlyRating = getEarlyPowerRating(hero);
    if (earlyRating !== null && earlyRating >= 1) {
      score += weightedPoints(earlyRating >= 2 ? 2 : 1, w.early);
      reasons.push('Tempo early');
    }

    var teamNeedsCount = getTeamNeedsCount(hero);
    if (teamNeedsCount >= 3) {
      score -= weightedPoints(2, w.setupPenalty);
      reasons.push('Butuh setup tim');
    } else if (teamNeedsCount === 2) {
      score -= weightedPoints(1, w.setupPenalty);
      reasons.push('Butuh setup tim');
    }

    if (reasons.length === 0) {
      reasons.push('First pick aman');
    }

    return { score: score, reasons: reasons };
  }

  function computeBlindFirstPickTop(availableHeroes, activeTab) {
    var tab = isValidRecTab(activeTab) ? activeTab : REC_TAB_SMART;

    var candidates = [];

    for (var i = 0; i < availableHeroes.length; i++) {
      var hero = availableHeroes[i];
      if (!hero) continue;
      if (tab !== REC_TAB_SMART && !heroCanPlayLane(hero, tab)) continue;

      var laneForScoring = (tab === REC_TAB_SMART) ? normalizeRole(hero.role) : tab;
      var s = scoreHeroForFirstPick(hero, laneForScoring);

      var score = s.score;
      var reasons = s.reasons;

      // Prefer hero with the lane as primary role over flex (secondaryRoles).
      if (tab !== REC_TAB_SMART && normalizeRole(hero.role) === tab) {
        score += 2;
      } else if (tab !== REC_TAB_SMART && heroIsSecondaryLane(hero, tab)) {
        reasons = reasons.slice();
        reasons.push('Flex: bisa main ' + tab);
      }

      candidates.push({ hero: hero, score: score, reasons: reasons });
    }

    candidates.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.hero.name.localeCompare(b.hero.name);
    });

    return candidates.slice(0, 5);
  }

  function missingLaneRoles(summary) {
    var roles = (summary && summary.roles) ? summary.roles : {};
    var missing = [];

    for (var i = 0; i < LANE_ROLES.length; i++) {
      var lane = LANE_ROLES[i];
      if (!(roles[lane] > 0)) missing.push(lane);
    }

    return missing;
  }

  function computeSmartTop(availableHeroes, summary, enemyPicks) {
    var openRoles = missingLaneRoles(summary);
    var candidates = [];

    for (var i = 0; i < availableHeroes.length; i++) {
      var hero = availableHeroes[i];
      if (!hero) continue;

      // If some lanes are still empty, Smart should focus on heroes that can fill them.
      if (openRoles.length > 0) {
        var playable = [];
        for (var r = 0; r < openRoles.length; r++) {
          if (heroCanPlayLane(hero, openRoles[r])) playable.push(openRoles[r]);
        }
        if (playable.length === 0) continue;

        var best = null;

        for (var p = 0; p < playable.length; p++) {
          var laneForScoring = playable[p];
          var s = scoreHeroForTeam(hero, summary, enemyPicks, laneForScoring);
          var reasons = s.reasons;

          if (heroIsSecondaryLane(hero, laneForScoring)) {
            reasons = reasons.slice();
            reasons.push('Flex: bisa main ' + laneForScoring);
          }

          if (!best || s.score > best.score) {
            best = { hero: hero, score: s.score, reasons: reasons };
          }
        }

        if (best) candidates.push(best);
      } else {
        var s2 = scoreHeroForTeam(hero, summary, enemyPicks);
        candidates.push({ hero: hero, score: s2.score, reasons: s2.reasons });
      }
    }

    candidates.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.hero.name.localeCompare(b.hero.name);
    });

    return candidates.slice(0, 5);
  }

  function normalizeNameKey(name) {
    return String(name || '').trim().toLowerCase();
  }

  function getSynergy(hero) {
    return (hero && hero.coachProfile && hero.coachProfile.synergy) ? hero.coachProfile.synergy : null;
  }

  function heroRefMatchesHero(ref, hero) {
    if (!ref || !hero) return false;

    if (ref.heroId && hero.id === ref.heroId) return true;
    if (ref.externalName && normalizeNameKey(hero.name) === normalizeNameKey(ref.externalName)) return true;

    return false;
  }

  function pickedHeroesFromTeam(teamPicks) {
    var out = [];
    for (var i = 0; i < teamPicks.length; i++) {
      if (teamPicks[i]) out.push(teamPicks[i]);
    }
    return out;
  }

  function pickedHeroesContainRef(pickedHeroes, ref) {
    for (var i = 0; i < pickedHeroes.length; i++) {
      if (heroRefMatchesHero(ref, pickedHeroes[i])) return true;
    }
    return false;
  }

  function refsFromTrioEntry(entry) {
    var out = [];
    if (!entry) return out;

    if (Array.isArray(entry.externalNames)) {
      for (var i = 0; i < entry.externalNames.length; i++) {
        out.push({ externalName: entry.externalNames[i] });
      }
      return out;
    }

    if (Array.isArray(entry.heroIds)) {
      for (var j = 0; j < entry.heroIds.length; j++) {
        out.push({ heroId: entry.heroIds[j] });
      }
      return out;
    }

    return out;
  }

  function synergyPointsFromPct(pct) {
    if (pct >= 5) return 2;
    return 1;
  }

  function computeBestSynergy(candidateHero, pickedHeroes) {
    var best = null;

    var s = getSynergy(candidateHero);
    if (s) {
      if (Array.isArray(s.duo)) {
        for (var i = 0; i < s.duo.length; i++) {
          var d = s.duo[i];
          if (!d || typeof d.compatibilityPct !== 'number') continue;

          if (pickedHeroesContainRef(pickedHeroes, d)) {
            if (!best || d.compatibilityPct > best.compatibilityPct) {
              best = {
                type: 'duo',
                base: candidateHero.name,
                partnersLabel: d.externalName || d.heroId || 'Unknown',
                compatibilityPct: d.compatibilityPct
              };
            }
          }
        }
      }

      if (Array.isArray(s.trio)) {
        for (var j = 0; j < s.trio.length; j++) {
          var t = s.trio[j];
          if (!t || typeof t.compatibilityPct !== 'number') continue;

          var refs = refsFromTrioEntry(t);
          if (refs.length !== 2) continue;

          if (pickedHeroesContainRef(pickedHeroes, refs[0]) && pickedHeroesContainRef(pickedHeroes, refs[1])) {
            if (!best || t.compatibilityPct > best.compatibilityPct) {
              best = {
                type: 'trio',
                base: candidateHero.name,
                partnersLabel: (refs[0].externalName || refs[0].heroId || 'Unknown') + ' + ' + (refs[1].externalName || refs[1].heroId || 'Unknown'),
                compatibilityPct: t.compatibilityPct
              };
            }
          }
        }
      }
    }

    // Reverse match: if an already-picked hero's synergy points to candidate.
    for (var k = 0; k < pickedHeroes.length; k++) {
      var baseHero = pickedHeroes[k];
      var bs = getSynergy(baseHero);
      if (!bs) continue;

      if (Array.isArray(bs.duo)) {
        for (var m = 0; m < bs.duo.length; m++) {
          var bd = bs.duo[m];
          if (!bd || typeof bd.compatibilityPct !== 'number') continue;

          if (heroRefMatchesHero(bd, candidateHero)) {
            if (!best || bd.compatibilityPct > best.compatibilityPct) {
              best = {
                type: 'duo',
                base: baseHero.name,
                partnersLabel: candidateHero.name,
                compatibilityPct: bd.compatibilityPct
              };
            }
          }
        }
      }

      if (Array.isArray(bs.trio)) {
        for (var n = 0; n < bs.trio.length; n++) {
          var bt = bs.trio[n];
          if (!bt || typeof bt.compatibilityPct !== 'number') continue;

          var bRefs = refsFromTrioEntry(bt);
          if (bRefs.length !== 2) continue;

          var hasCandidate = heroRefMatchesHero(bRefs[0], candidateHero) || heroRefMatchesHero(bRefs[1], candidateHero);
          if (!hasCandidate) continue;

          // Need the other partner already picked.
          var otherRef = heroRefMatchesHero(bRefs[0], candidateHero) ? bRefs[1] : bRefs[0];
          if (pickedHeroesContainRef(pickedHeroes, otherRef)) {
            if (!best || bt.compatibilityPct > best.compatibilityPct) {
              best = {
                type: 'trio',
                base: baseHero.name,
                partnersLabel: candidateHero.name + ' + ' + (otherRef.externalName || otherRef.heroId || 'Unknown'),
                compatibilityPct: bt.compatibilityPct
              };
            }
          }
        }
      }
    }

    return best;
  }

  function computeSynergyBonus(candidateHero, pickedHeroes) {
    if (!pickedHeroes || pickedHeroes.length === 0) return null;

    var best = computeBestSynergy(candidateHero, pickedHeroes);
    if (!best) return null;

    var points = synergyPointsFromPct(best.compatibilityPct);

    return {
      score: points,
      reason: 'Sinergi ' + best.type + ': ' + best.base + ' ↔ ' + best.partnersLabel + ' (' + best.compatibilityPct.toFixed(2) + '%)'
    };
  }

  function computeDenyBonus(candidateHero, roleIsOpen, enemyPickedHeroes) {
    if (!roleIsOpen) return null;
    if (!enemyPickedHeroes || enemyPickedHeroes.length === 0) return null;

    var softDuo = enemyPickedHeroes.length < 2;
    var softDuoMinCompatibilityPct = 4;

    function pickBetter(curr, next) {
      if (!curr) return next;
      if (!next) return curr;
      if (next.compatibilityPct > curr.compatibilityPct) return next;
      return curr;
    }

    var best = null;

    for (var i = 0; i < enemyPickedHeroes.length; i++) {
      var baseHero = enemyPickedHeroes[i];
      var s = getSynergy(baseHero);
      if (!s) continue;

      if (Array.isArray(s.trio)) {
        for (var j = 0; j < s.trio.length; j++) {
          var t = s.trio[j];
          if (!t || typeof t.compatibilityPct !== 'number') continue;

          var refs = refsFromTrioEntry(t);
          if (refs.length !== 2) continue;

          var has0 = pickedHeroesContainRef(enemyPickedHeroes, refs[0]);
          var has1 = pickedHeroesContainRef(enemyPickedHeroes, refs[1]);

          // We only care about 2-of-3 situations: baseHero already picked, plus exactly one partner.
          if ((has0 && !has1 && heroRefMatchesHero(refs[1], candidateHero)) || (!has0 && has1 && heroRefMatchesHero(refs[0], candidateHero))) {
            var missingLabel = candidateHero.name;
            var otherLabel = has0 ? (refs[0].externalName || refs[0].heroId || 'Unknown') : (refs[1].externalName || refs[1].heroId || 'Unknown');

            best = pickBetter(best, {
              type: 'trio',
              base: baseHero.name,
              partnersLabel: otherLabel + ' + ' + missingLabel,
              compatibilityPct: t.compatibilityPct
            });
          }
        }
      }

      if (Array.isArray(s.duo)) {
        for (var k = 0; k < s.duo.length; k++) {
          var d = s.duo[k];
          if (!d || typeof d.compatibilityPct !== 'number') continue;

          // Soft duo: musuh baru pick 1 hero, jadi kita hanya "catat" duo yang cukup kuat.
          if (softDuo && d.compatibilityPct < softDuoMinCompatibilityPct) continue;

          if (heroRefMatchesHero(d, candidateHero)) {
            best = pickBetter(best, {
              type: 'duo',
              base: baseHero.name,
              partnersLabel: candidateHero.name,
              compatibilityPct: d.compatibilityPct
            });
          }
        }
      }
    }

    if (!best) return null;

    var points = synergyPointsFromPct(best.compatibilityPct);
    if (softDuo && best.type === 'duo') points = 1;

    var label = (softDuo && best.type === 'duo') ? 'Watchlist deny' : 'Deny sinergi musuh';

    return {
      score: points,
      reason: label + ' ' + best.type + ': cegah ' + best.base + ' + ' + best.partnersLabel + ' (' + best.compatibilityPct.toFixed(2) + '%)'
    };
  }

  function computeTeamSummary(teamPicks, laneAssignments) {
    var roles = {};

    var hasFrontline = false;
    var hasHardFrontline = false;
    var hasCC = false;
    var hasPrimaryEngage = false;
    var hasPickPotential = false;
    var hasBurst = false;
    var hasDps = false;

    var countFrontlineMedium = 0;
    var countCCMedium = 0;
    var countPickMedium = 0;
    var countBurstMedium = 0;
    var countDpsMedium = 0;
    var countSustainMedium = 0;
    var countPeelMedium = 0;
    var countDisengageMedium = 0;
    var countMobilityMedium = 0;
    var countEngageMedium = 0;

    var maxSustain = 0;
    var maxPeel = 0;
    var maxDisengage = 0;

    var magicCount = 0;
    var physicalCount = 0;
    var pickedHeroes = [];

    for (var i = 0; i < teamPicks.length; i++) {
      var hero = teamPicks[i];
      if (!hero) continue;

      pickedHeroes.push(hero);

      var assignedLane = null;
      if (laneAssignments && laneAssignments[i]) {
        assignedLane = normalizeRole(laneAssignments[i]);
      }

      var role = normalizeRole(assignedLane || hero.role);
      roles[role] = (roles[role] || 0) + 1;

      var frontlineRating = getFrontlineRating(hero);
      if (frontlineRating !== null && frontlineRating >= 1) {
        hasFrontline = true;
        countFrontlineMedium++;
        if (frontlineRating >= 2) hasHardFrontline = true;
      }

      var ccRating = getCCRating(hero);
      if (ccRating !== null && ccRating >= 1) {
        hasCC = true;
        countCCMedium++;
      }

      var pickRating = getPickPotentialRating(hero);
      if (pickRating !== null && pickRating >= 1) {
        hasPickPotential = true;
        countPickMedium++;
      }

      var burstRating = getBurstRating(hero);
      if (burstRating !== null && burstRating >= 1) {
        hasBurst = true;
        countBurstMedium++;
      }

      var dpsRating = getDpsRating(hero);
      if (dpsRating !== null && dpsRating >= 1) {
        hasDps = true;
        countDpsMedium++;
      }

      var sustainRating = getSustainRating(hero);
      if (sustainRating !== null) {
        if (sustainRating >= 1) countSustainMedium++;
        if (sustainRating > maxSustain) {
          maxSustain = sustainRating;
        }
      }

      var peelRating = getPeelRating(hero);
      if (peelRating !== null) {
        if (peelRating >= 1) countPeelMedium++;
        if (peelRating > maxPeel) {
          maxPeel = peelRating;
        }
      }

      var disengageRating = getDisengageRating(hero);
      if (disengageRating !== null) {
        if (disengageRating >= 1) countDisengageMedium++;
        if (disengageRating > maxDisengage) {
          maxDisengage = disengageRating;
        }
      }

      var mobilityRating = getMobilityRating(hero);
      if (mobilityRating !== null && mobilityRating >= 1) {
        countMobilityMedium++;
      }

      var engageRating = getEngageRating(hero);
      if (engageRating !== null && engageRating >= 1) {
        countEngageMedium++;
      }

      var engageRole = getEngageRole(hero);
      if (engageRole === 'primary') {
        hasPrimaryEngage = true;
      }

      var tags = heroTags(hero);
      if (tags.indexOf('magic') !== -1) magicCount++;
      if (tags.indexOf('physical') !== -1) physicalCount++;
    }

    var f2bScore = 0;
    if (countDpsMedium > 0) f2bScore++;
    if (countFrontlineMedium > 0) f2bScore++;
    if (countPeelMedium > 0 || countDisengageMedium > 0 || countSustainMedium > 0) f2bScore++;

    var pickScore = 0;
    if (countPickMedium >= 2) pickScore++;
    if (countCCMedium >= 1) pickScore++;
    if (countBurstMedium >= 1) pickScore++;

    var diveScore = 0;
    if (countMobilityMedium >= 2) diveScore++;
    if (hasPrimaryEngage || countEngageMedium >= 1) diveScore++;
    if (countBurstMedium >= 1) diveScore++;

    var maxScore = Math.max(f2bScore, pickScore, diveScore);
    var primary = 'frontToBack';
    var primaryScore = f2bScore;

    // Tie-break:
    // - If signal is still weak (<= 1), keep default Front-to-Back to avoid overreacting.
    // - If signal is strong (>= 2), prefer Dive > Pick > Front-to-Back on ties.
    if (maxScore <= 1) {
      primary = 'frontToBack';
      primaryScore = f2bScore;
    } else if (diveScore === maxScore) {
      primary = 'dive';
      primaryScore = diveScore;
    } else if (pickScore === maxScore) {
      primary = 'pick';
      primaryScore = pickScore;
    } else {
      primary = 'frontToBack';
      primaryScore = f2bScore;
    }

    return {
      roles: roles,
      hasFrontline: hasFrontline,
      hasHardFrontline: hasHardFrontline,
      hasCC: hasCC,
      hasPrimaryEngage: hasPrimaryEngage,
      hasPickPotential: hasPickPotential,
      hasBurst: hasBurst,
      hasDps: hasDps,
      maxSustain: maxSustain,
      maxPeel: maxPeel,
      maxDisengage: maxDisengage,
      magicCount: magicCount,
      physicalCount: physicalCount,
      pickedHeroes: pickedHeroes,
      archetypeSignals: {
        frontToBack: f2bScore,
        pick: pickScore,
        dive: diveScore,
        primary: primary,
        primaryScore: primaryScore
      }
    };
  }

  function scoreHeroForTeam(hero, summary, enemyPicks, laneContext) {
    var score = 0;
    var reasons = [];

    var role = normalizeRole(laneContext) || normalizeRole(hero.role);
    var roleCount = summary.roles[role] || 0;

    // Prefer to fill missing lane roles.
    if (roleCount === 0) {
      score += 3;
      reasons.push('Mengisi role kosong: ' + role);
    } else if (roleCount === 1) {
      score += 1;
      reasons.push('Menambah opsi role: ' + role);
    }

    var frontlineRating = getFrontlineRating(hero);
    if (!summary.hasFrontline && frontlineRating !== null && frontlineRating >= 1) {
      score += 3;
      reasons.push('Menambah tank/frontline');
    }

    var ccRating = getCCRating(hero);
    if (!summary.hasCC && ccRating !== null && ccRating >= 1) {
      score += 2;
      reasons.push('Menambah crowd control');
    }

    var pickRating = getPickPotentialRating(hero);
    if (!summary.hasPickPotential && pickRating !== null && pickRating >= 1) {
      score += pickRating;
      reasons.push('Menambah pick potential');
    }

    var burstRating = getBurstRating(hero);
    if (!summary.hasBurst && burstRating !== null && burstRating >= 1) {
      score += burstRating;
      reasons.push('Menambah burst damage');
    }

    var dpsRating = getDpsRating(hero);
    if (!summary.hasDps && dpsRating !== null && dpsRating >= 1) {
      score += dpsRating;
      reasons.push('Menambah DPS berkelanjutan');
    }

    // Support utilities (sustain/peel/disengage) are most valuable when filling a missing lane role.
    if (roleCount === 0) {
      var sustainRating = getSustainRating(hero);
      if (sustainRating !== null && sustainRating > (summary.maxSustain || 0)) {
        score += (sustainRating - (summary.maxSustain || 0));
        reasons.push('Menambah sustain/heal');
      }

      var peelRating = getPeelRating(hero);
      if (peelRating !== null && peelRating > (summary.maxPeel || 0)) {
        score += (peelRating - (summary.maxPeel || 0));
        reasons.push('Menambah peel/proteksi');
      }

      var disengageRating = getDisengageRating(hero);
      if (disengageRating !== null && disengageRating > (summary.maxDisengage || 0)) {
        score += (disengageRating - (summary.maxDisengage || 0));
        reasons.push('Menambah disengage');
      }
    }

    var engageRole = getEngageRole(hero);
    var engageRating = getEngageRating(hero);

    if (!summary.hasPrimaryEngage) {
      if (engageRole === 'primary') {
        score += 3;
        reasons.push('Menambah primary engage (pembuka war)');
      } else if (engageRole === 'secondary' && engageRating !== null && engageRating >= 1) {
        score -= 1;
        reasons.push('Hero follow-up: butuh primary engage dulu agar lebih aman');
      }
    } else {
      if (engageRole === 'secondary' && engageRating !== null && engageRating >= 1) {
        score += 1;
        reasons.push('Menambah follow-up engage');
      } else if (engageRole === 'primary') {
        score += 1;
        reasons.push('Menambah opsi engage tambahan');
      }
    }

    var signals = summary.archetypeSignals;
    if (signals && signals.primaryScore >= 2) {
      if (signals.primary === 'frontToBack') {
        var peelRating2 = getPeelRating(hero);
        if (frontlineRating !== null && frontlineRating >= 1) {
          score += 1;
          reasons.push('Archetype F2B: frontline');
        }
        if (peelRating2 !== null && peelRating2 >= 1) {
          score += 1;
          reasons.push('Archetype F2B: peel');
        }
        if (ccRating !== null && ccRating >= 1) {
          score += 1;
          reasons.push('Archetype F2B: CC');
        }
      } else if (signals.primary === 'pick') {
        if (ccRating !== null && ccRating >= 1) {
          score += 1;
          reasons.push('Archetype Pick: CC');
        }
        if (pickRating !== null && pickRating >= 1) {
          score += 1;
          reasons.push('Archetype Pick: pick');
        }
        if (burstRating !== null && burstRating >= 1) {
          score += 1;
          reasons.push('Archetype Pick: burst');
        }
      } else if (signals.primary === 'dive') {
        var mobilityRating2 = getMobilityRating(hero);
        if (mobilityRating2 !== null && mobilityRating2 >= 1) {
          score += 1;
          reasons.push('Archetype Dive: mobility');
        }
        if (engageRating !== null && engageRating >= 1) {
          score += 1;
          reasons.push('Archetype Dive: engage');
        }
        if (burstRating !== null && burstRating >= 1) {
          score += 1;
          reasons.push('Archetype Dive: burst');
        }
      }
    }

    // Countering vs enemy draft (Global V2): start with Front-to-Back (F2B).
    var enemyPickedCount = pickedHeroesFromTeam(enemyPicks || []).length;
    if (enemyPickedCount > 0) {
      var enemyInfoFactor = 0;
      if (enemyPickedCount === 1) enemyInfoFactor = 0.25;
      else if (enemyPickedCount <= 3) enemyInfoFactor = 0.6;
      else enemyInfoFactor = 1.0;

      var enemySummary = computeTeamSummary(enemyPicks || [], null);
      var enemySignals = enemySummary && enemySummary.archetypeSignals;

      if (enemySignals && enemySignals.primary === 'frontToBack' && enemySignals.frontToBack > 0) {
        var f2bCounterBase = 0;

        if (engageRole === 'primary' && engageRating !== null && engageRating >= 1) {
          f2bCounterBase += 2;
        } else if (engageRating !== null && engageRating >= 1) {
          f2bCounterBase += 1;
        }

        if (pickRating !== null && pickRating >= 1) {
          f2bCounterBase += 1;
        }

        var mobilityRating3 = getMobilityRating(hero);
        if (mobilityRating3 !== null && mobilityRating3 >= 1) {
          f2bCounterBase += 1;
        }

        if ((burstRating !== null && burstRating >= 2) || (dpsRating !== null && dpsRating >= 2)) {
          f2bCounterBase += 2;
        } else if ((burstRating !== null && burstRating >= 1) || (dpsRating !== null && dpsRating >= 1)) {
          f2bCounterBase += 1;
        }

        if (ccRating !== null && ccRating >= 1) {
          f2bCounterBase += 1;
        }

        var f2bCounterScore = Math.round(f2bCounterBase * enemyInfoFactor);
        if (f2bCounterScore > 0) {
          score += f2bCounterScore;
          reasons.push('Counter enemy F2B');
        }

        // Small penalty: hero butuh setup tinggi tapi tidak membantu engage/pick.
        var teamNeedsCount = getTeamNeedsCount(hero);
        var hasEngageOrPick = (engageRating !== null && engageRating >= 1) || (pickRating !== null && pickRating >= 1);

        if (!hasEngageOrPick && teamNeedsCount >= 3) {
          var penaltyHighSetup = Math.round(2 * enemyInfoFactor);
          if (penaltyHighSetup > 0) {
            score -= penaltyHighSetup;
            reasons.push('Counter F2B: setup tinggi');
          }
        } else if (!hasEngageOrPick && teamNeedsCount === 2) {
          var penaltySetup = Math.round(1 * enemyInfoFactor);
          if (penaltySetup > 0) {
            score -= penaltySetup;
            reasons.push('Counter F2B: butuh setup');
          }
        }
      } else if (enemySignals && enemySignals.primary === 'pick' && enemySignals.pick > 0) {
        var hasProtectionBaseline = summary.hasFrontline && (((summary.maxPeel || 0) >= 1) || ((summary.maxDisengage || 0) >= 1));

        var antiCatchBase = 0;

        if (frontlineRating !== null && frontlineRating >= 2) antiCatchBase += 2;
        else if (frontlineRating !== null && frontlineRating >= 1) antiCatchBase += 1;

        var peelRatingPick = getPeelRating(hero);
        if (peelRatingPick !== null && peelRatingPick >= 2) antiCatchBase += 2;
        else if (peelRatingPick !== null && peelRatingPick >= 1) antiCatchBase += 1;

        var disengageRatingPick = getDisengageRating(hero);
        if (disengageRatingPick !== null && disengageRatingPick >= 2) antiCatchBase += 2;
        else if (disengageRatingPick !== null && disengageRatingPick >= 1) antiCatchBase += 1;

        var mobilityRatingPick = getMobilityRating(hero);
        if (mobilityRatingPick !== null && mobilityRatingPick >= 1) antiCatchBase += 1;

        if (ccRating !== null && ccRating >= 2) antiCatchBase += 2;
        else if (ccRating !== null && ccRating >= 1) antiCatchBase += 1;

        var sustainRatingPick = getSustainRating(hero);
        if (sustainRatingPick !== null && sustainRatingPick >= 1) antiCatchBase += 1;

        var antiCatchScore = Math.round(antiCatchBase * enemyInfoFactor);

        var punishBase = 0;
        if (hasProtectionBaseline) {
          if (engageRole === 'primary' && engageRating !== null && engageRating >= 1) punishBase += 2;
          else if (engageRating !== null && engageRating >= 1) punishBase += 1;

          if (mobilityRatingPick !== null && mobilityRatingPick >= 1) punishBase += 1;

          if ((burstRating !== null && burstRating >= 2) || (dpsRating !== null && dpsRating >= 2)) {
            punishBase += 2;
          } else if ((burstRating !== null && burstRating >= 1) || (dpsRating !== null && dpsRating >= 1)) {
            punishBase += 1;
          }

          if (pickRating !== null && pickRating >= 1) punishBase += 1;
          if (ccRating !== null && ccRating >= 1) punishBase += 1;
        }

        var punishScore = Math.round(punishBase * enemyInfoFactor);
        var pickCounterScore = antiCatchScore + punishScore;

        if (pickCounterScore > 0) {
          score += pickCounterScore;
          reasons.push('Counter enemy Pick');

          if (antiCatchScore > 0) reasons.push('Counter Pick: anti-catch');
          if (punishScore > 0) reasons.push('Counter Pick: punish');
        }

        // Saat tim belum punya proteksi dasar: prioritaskan anti-catch dan hindari pick yang tidak punya tool proteksi.
        if (!hasProtectionBaseline) {
          var defensiveTools = 0;
          if (frontlineRating !== null && frontlineRating >= 1) defensiveTools++;
          if (peelRatingPick !== null && peelRatingPick >= 1) defensiveTools++;
          if (disengageRatingPick !== null && disengageRatingPick >= 1) defensiveTools++;

          if (defensiveTools === 0) {
            var noDefensePenalty = Math.round(2 * enemyInfoFactor);
            if (noDefensePenalty > 0) {
              score -= noDefensePenalty;
              reasons.push('Counter Pick: minim proteksi');
            }
          } else if (defensiveTools === 1) {
            var lowDefensePenalty = Math.round(1 * enemyInfoFactor);
            if (lowDefensePenalty > 0) {
              score -= lowDefensePenalty;
              reasons.push('Counter Pick: kurang proteksi');
            }
          }

          var lowEscape = (mobilityRatingPick === null || mobilityRatingPick === 0) && ((disengageRatingPick === null || disengageRatingPick === 0));
          if (lowEscape) {
            var catchPenalty = Math.round(1 * enemyInfoFactor);
            if (catchPenalty > 0) {
              score -= catchPenalty;
              reasons.push('Counter Pick: rentan');
            }
          }
        }
      } else if (enemySignals && enemySignals.primary === 'dive' && enemySignals.dive > 0) {
        var diveCounterBase = 0;

        if (frontlineRating !== null && frontlineRating >= 2) diveCounterBase += 2;
        else if (frontlineRating !== null && frontlineRating >= 1) diveCounterBase += 1;

        var peelRating3 = getPeelRating(hero);
        if (peelRating3 !== null && peelRating3 >= 2) diveCounterBase += 2;
        else if (peelRating3 !== null && peelRating3 >= 1) diveCounterBase += 1;

        var disengageRating3 = getDisengageRating(hero);
        if (disengageRating3 !== null && disengageRating3 >= 2) diveCounterBase += 2;
        else if (disengageRating3 !== null && disengageRating3 >= 1) diveCounterBase += 1;

        if (ccRating !== null && ccRating >= 2) diveCounterBase += 2;
        else if (ccRating !== null && ccRating >= 1) diveCounterBase += 1;

        var sustainRating3 = getSustainRating(hero);
        if (sustainRating3 !== null && sustainRating3 >= 1) diveCounterBase += 1;

        var mobilityRating4 = getMobilityRating(hero);
        if (mobilityRating4 !== null && mobilityRating4 >= 1) diveCounterBase += 1;

        var diveCounterScore = Math.round(diveCounterBase * enemyInfoFactor);
        if (diveCounterScore > 0) {
          score += diveCounterScore;
          reasons.push('Counter enemy Dive');
        }

        // Penalize immobile Farm Lane core when enemy has multiple dive tools.
        if (role === 'Farm Lane') {
          var immobile = (mobilityRating4 === null || mobilityRating4 === 0) && ((disengageRating3 === null || disengageRating3 === 0));
          if (immobile) {
            var carryPenalty = Math.round(2 * enemyInfoFactor);
            if (carryPenalty > 0) {
              score -= carryPenalty;
              reasons.push('Counter Dive: carry statis');
            }
          }
        }
      }
    }

    var tags = heroTags(hero);

    var diff = summary.magicCount - summary.physicalCount;
    var isMagic = tags.indexOf('magic') !== -1;
    var isPhysical = tags.indexOf('physical') !== -1;

    // Try to keep damage types not too one-sided.
    if (summary.physicalCount === 0 && isPhysical) {
      score += 2;
      reasons.push('Menambah damage physical');
    } else if (summary.magicCount === 0 && isMagic) {
      score += 2;
      reasons.push('Menambah damage magic');
    } else if (diff >= 2 && isPhysical) {
      score += 2;
      reasons.push('Menyeimbangkan damage (lebih physical)');
    } else if (diff <= -2 && isMagic) {
      score += 2;
      reasons.push('Menyeimbangkan damage (lebih magic)');
    } else if (diff >= 1 && isPhysical) {
      score += 1;
      reasons.push('Mendekatkan balance damage (physical)');
    } else if (diff <= -1 && isMagic) {
      score += 1;
      reasons.push('Mendekatkan balance damage (magic)');
    }



    var pickedHeroes = summary.pickedHeroes || [];

    var synergyBonus = computeSynergyBonus(hero, pickedHeroes);
    if (synergyBonus) {
      score += synergyBonus.score;
      reasons.push(synergyBonus.reason);
    }

    var roleIsOpen = roleCount === 0;
    var enemyPickedHeroes = pickedHeroesFromTeam(enemyPicks || []);

    var denyBonus = computeDenyBonus(hero, roleIsOpen, enemyPickedHeroes);
    if (denyBonus) {
      score += denyBonus.score;
      reasons.push(denyBonus.reason);
    }

    if (reasons.length === 0) {
      reasons.push('Pilihan solid untuk komposisi saat ini');
    }

    return { score: score, reasons: reasons };
  }

  function DraftPickApp(options) {
    var opts = options || {};

    this.heroes = Array.isArray(opts.heroes) ? opts.heroes.slice() : HEROES.slice();

    this.state = {
      mode: 'solo',
      pickTarget: 'ally',
      autoDraftOrder: false,
      firstPickTeam: null,
      draftStarted: false,
      advancedRecommendations: false,
      search: '',
      role: 'All',
      recommendationLane: null,
      userSlotIndex: 0,
      userLane: '',
      laneOverrides: {
        ally: []
      },
      pickedById: {},
      teams: {
        ally: [],
        enemy: []
      }
    };

    this.nodes = null;
    this.lanePopover = null;
    this.lanePopoverContext = null;
  }

  DraftPickApp.prototype.mount = function () {
    var root = byId('draft-app');
    if (!root) return;

    var allySlots = (byId('kita-slots') || root).querySelectorAll('.slot');
    var enemySlots = (byId('musuh-slots') || root).querySelectorAll('.slot');

    this.state.teams.ally = new Array(allySlots.length);
    this.state.teams.enemy = new Array(enemySlots.length);
    this.state.laneOverrides.ally = new Array(allySlots.length);
    for (var i = 0; i < allySlots.length; i++) {
      this.state.teams.ally[i] = null;
      this.state.laneOverrides.ally[i] = '';
    }
    for (var j = 0; j < enemySlots.length; j++) this.state.teams.enemy[j] = null;

    this.nodes = {
      root: root,
      searchInput: byId('hero-search'),
      roleSelect: byId('hero-role'),
      roleTabs: root.querySelectorAll('[data-role-filter]'),
      heroGrid: byId('hero-grid'),
      recommendationsTitle: byId('recommendations-title'),
      recommendationsArchetype: byId('recommendations-archetype'),
      recommendationsNav: byId('recommendations-nav'),
      recommendationsList: byId('recommendations-list'),
      advancedBtn: byId('btn-advanced'),
      autoOrderBtn: byId('btn-auto-order'),
      message: byId('draft-message'),
      resetBtn: byId('btn-reset'),
      pickTargetButtons: root.querySelectorAll('[data-pick-target]'),
      modeButtons: root.querySelectorAll('[data-mode]'),
      slotEls: {
        ally: allySlots,
        enemy: enemySlots
      }
    };

    this.renderRoleOptions();
    this.bind();
    this.render();
  };

  DraftPickApp.prototype.setMessage = function (text) {
    if (!this.nodes || !this.nodes.message) return;
    this.nodes.message.textContent = text;
  };

  DraftPickApp.prototype.syncModeButtons = function () {
    if (!this.nodes || !this.nodes.modeButtons) return;

    for (var i = 0; i < this.nodes.modeButtons.length; i++) {
      var btn = this.nodes.modeButtons[i];
      var mode = btn.getAttribute('data-mode');
      var active = mode === this.state.mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  };

  DraftPickApp.prototype.recommendationsTeamKey = function () {
    return this.state.advancedRecommendations ? this.state.pickTarget : 'ally';
  };

  DraftPickApp.prototype.syncAdvancedButton = function () {
    if (!this.nodes || !this.nodes.advancedBtn) return;

    if (this.state.autoDraftOrder && this.state.advancedRecommendations) {
      this.state.advancedRecommendations = false;
    }

    var locked = Boolean(this.state.autoDraftOrder);
    var active = Boolean(this.state.advancedRecommendations);

    this.nodes.advancedBtn.disabled = locked;
    this.nodes.advancedBtn.setAttribute('aria-disabled', locked ? 'true' : 'false');
    this.nodes.advancedBtn.classList.toggle('is-active', active);
    this.nodes.advancedBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
  };

  DraftPickApp.prototype.syncAutoOrderButton = function () {
    if (!this.nodes || !this.nodes.autoOrderBtn) return;

    var started = this.totalPicks() > 0 || Boolean(this.state.draftStarted);
    if (started && !this.state.draftStarted) this.state.draftStarted = true;

    var active = Boolean(this.state.autoDraftOrder);
    this.nodes.autoOrderBtn.classList.toggle('is-active', active);
    this.nodes.autoOrderBtn.setAttribute('aria-pressed', active ? 'true' : 'false');

    this.nodes.autoOrderBtn.disabled = started;
    this.nodes.autoOrderBtn.setAttribute('aria-disabled', started ? 'true' : 'false');
  };

  DraftPickApp.prototype.pickCount = function (teamKey) {
    var picks = this.state.teams[teamKey] || [];
    var out = 0;
    for (var i = 0; i < picks.length; i++) {
      if (picks[i]) out++;
    }
    return out;
  };

  DraftPickApp.prototype.totalPicks = function () {
    return this.pickCount('ally') + this.pickCount('enemy');
  };

  DraftPickApp.prototype.autoDraftNextTarget = function () {
    var total = this.totalPicks();
    if (total >= AUTO_DRAFT_PATTERN.length) return null;

    var first = this.state.firstPickTeam;
    if (TEAM_KEYS.indexOf(first) === -1) first = this.state.pickTarget;
    if (TEAM_KEYS.indexOf(first) === -1) first = 'ally';

    var other = oppositeTeam(first);
    return AUTO_DRAFT_PATTERN[total] === 0 ? first : other;
  };

  DraftPickApp.prototype.applyAutoDraftOrder = function () {
    if (!this.state.autoDraftOrder) return;

    if (TEAM_KEYS.indexOf(this.state.firstPickTeam) === -1) {
      this.state.firstPickTeam = this.state.pickTarget;
    }

    this.state.advancedRecommendations = false;
    var next = this.autoDraftNextTarget();
    if (next) this.state.pickTarget = next;
  };

  DraftPickApp.prototype.setUserSlotIndex = function (idx) {
    var next = Number(idx);
    if (Number.isNaN(next)) next = 0;
    if (next < 0) next = 0;
    if (next >= this.state.teams.ally.length) next = this.state.teams.ally.length - 1;
    this.state.userSlotIndex = next;
    this.renderTeams();
    this.renderRecommendations();
  };

  DraftPickApp.prototype.setUserLane = function (lane) {
    var l = normalizeRole(lane);
    this.state.userLane = l;

    if (LANE_ROLES.indexOf(l) !== -1) {
      this.state.recommendationLane = l;
    }

    this.renderTeams();
    this.renderRecommendations();
  };

  DraftPickApp.prototype.allyLaneAssignments = function () {
    var lanes = new Array(this.state.teams.ally.length);
    for (var i = 0; i < lanes.length; i++) {
      lanes[i] = this.laneForAllySlot(i);
    }
    return lanes;
  };

  DraftPickApp.prototype.laneForAllySlot = function (idx) {
    var hero = this.state.teams.ally[idx];

    if (idx === this.state.userSlotIndex && normalizeRole(this.state.userLane)) {
      return normalizeRole(this.state.userLane);
    }

    var overrideLane = this.state.laneOverrides && this.state.laneOverrides.ally ? this.state.laneOverrides.ally[idx] : '';
    if (overrideLane) return normalizeRole(overrideLane);

    if (hero) return normalizeRole(hero.role);

    return '';
  };

  DraftPickApp.prototype.ensureLanePopover = function () {
    var self = this;

    if (this.lanePopover) return;

    var pop = el('div', { className: 'lane-popover', role: 'dialog', 'aria-label': 'Pilih lane' });
    pop.hidden = true;

    var title = el('div', { className: 'lane-popover__title', text: 'Pilih lane' });
    var list = el('div', { className: 'lane-popover__list' });

    function addOption(label, laneValue) {
      var btn = el('button', { className: 'lane-popover__btn', type: 'button' });
      btn.textContent = label;
      btn.addEventListener('click', function () {
        if (!self.lanePopoverContext) return;

        var idx = self.lanePopoverContext.slotIndex;
        if (idx === self.state.userSlotIndex) {
          self.setUserLane(laneValue);
        } else {
          self.state.laneOverrides.ally[idx] = laneValue;
          self.renderTeams();
          self.renderRecommendations();
        }

        self.hideLanePopover();
      });
      list.appendChild(btn);
    }

    addOption('(Auto)', '');
    for (var i = 0; i < LANE_ROLES.length; i++) {
      addOption(LANE_ROLES[i], LANE_ROLES[i]);
    }

    pop.appendChild(title);
    pop.appendChild(list);

    document.body.appendChild(pop);

    this.lanePopover = pop;
  };

  DraftPickApp.prototype.showLanePopover = function (teamKey, slotIndex, anchorEl) {
    if (teamKey !== 'ally') return;

    this.ensureLanePopover();

    this.lanePopoverContext = {
      teamKey: teamKey,
      slotIndex: slotIndex
    };

    var rect = anchorEl.getBoundingClientRect();
    var left = rect.left + window.scrollX;
    var top = rect.bottom + window.scrollY + 6;

    this.lanePopover.style.left = left + 'px';
    this.lanePopover.style.top = top + 'px';
    this.lanePopover.hidden = false;
  };

  DraftPickApp.prototype.hideLanePopover = function () {
    if (!this.lanePopover) return;
    this.lanePopover.hidden = true;
    this.lanePopoverContext = null;
  };

  DraftPickApp.prototype.bind = function () {
    var self = this;

    if (this.nodes.searchInput) {
      this.nodes.searchInput.addEventListener('input', function (e) {
        self.state.search = e.target.value || '';
        self.renderGrid();
      });
    }

    if (this.nodes.roleSelect) {
      this.nodes.roleSelect.addEventListener('change', function (e) {
        var value = e.target.value;
        self.state.role = value;
        self.syncRoleTabs();
        self.renderGrid();
      });
    }

    if (this.nodes.roleTabs) {
      for (var t = 0; t < this.nodes.roleTabs.length; t++) {
        this.nodes.roleTabs[t].addEventListener('click', function (e) {
          var value = e.currentTarget.getAttribute('data-role-filter');
          if (!value) return;
          self.state.role = value;
          if (self.nodes.roleSelect) self.nodes.roleSelect.value = value;
          self.syncRoleTabs();
          self.renderGrid();
        });
      }
    }

    if (this.nodes.modeButtons) {
      for (var m = 0; m < this.nodes.modeButtons.length; m++) {
        this.nodes.modeButtons[m].addEventListener('click', function (e) {
          var mode = e.currentTarget.getAttribute('data-mode');
          if (!mode) return;
          if (e.currentTarget.disabled || e.currentTarget.getAttribute('aria-disabled') === 'true') return;

          self.state.mode = mode;
          self.syncModeButtons();
          self.renderTeams();
          self.renderRecommendations();
        });
      }
    }

    if (this.nodes.advancedBtn) {
      this.nodes.advancedBtn.addEventListener('click', function () {
        if (self.state.autoDraftOrder) return;
        self.state.advancedRecommendations = !self.state.advancedRecommendations;
        self.syncAdvancedButton();
        self.renderRecommendations();
      });
    }

    if (this.nodes.autoOrderBtn) {
      this.nodes.autoOrderBtn.addEventListener('click', function (e) {
        if (self.state.draftStarted || self.totalPicks() > 0) return;
        if (e.currentTarget.disabled || e.currentTarget.getAttribute('aria-disabled') === 'true') return;

        self.state.autoDraftOrder = !self.state.autoDraftOrder;

        if (self.state.autoDraftOrder) {
          self.state.firstPickTeam = self.state.pickTarget;
          self.state.advancedRecommendations = false;
          self.applyAutoDraftOrder();
        } else {
          self.state.firstPickTeam = null;
        }

        self.render();
      });
    }

    if (this.nodes.pickTargetButtons) {
      for (var i = 0; i < this.nodes.pickTargetButtons.length; i++) {
        this.nodes.pickTargetButtons[i].addEventListener('click', function (e) {
          if (self.state.autoDraftOrder) return;
          var teamKey = e.currentTarget.getAttribute('data-pick-target');
          if (TEAM_KEYS.indexOf(teamKey) === -1) return;
          self.state.pickTarget = teamKey;
          self.syncPickTargetButtons();
          if (self.state.advancedRecommendations) {
            self.renderRecommendations();
          }
        });
      }
    }

    if (this.nodes.heroGrid) {
      this.nodes.heroGrid.addEventListener('click', function (e) {
        var card = e.target.closest('.hero-card');
        if (!card) return;
        var heroId = card.getAttribute('data-hero-id');
        if (!heroId) return;
        if (card.disabled || card.getAttribute('aria-disabled') === 'true') return;
        self.pick(heroId, { source: 'grid' });
      });
    }

    if (this.nodes.recommendationsNav) {
      this.nodes.recommendationsNav.addEventListener('click', function (e) {
        var laneBtn = e.target.closest('[data-action="rec-lane"]');
        if (laneBtn) {
          var lane = laneBtn.getAttribute('data-rec-lane');
          if (lane === REC_TAB_SMART || LANE_ROLES.indexOf(lane) !== -1) {
            self.state.recommendationLane = lane;
            self.renderRecommendations();
          }
        }
      });
    }

    if (this.nodes.recommendationsList) {
      this.nodes.recommendationsList.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-hero-id]');
        if (!btn) return;
        var heroId = btn.getAttribute('data-hero-id');
        if (!heroId) return;
        self.pick(heroId, { source: 'recommendation' });
      });
    }

    // Slot interactions (event delegation).
    this.nodes.root.addEventListener('click', function (e) {
      var laneBtn = e.target.closest('[data-action="set-lane"]');
      if (laneBtn) {
        var laneSlot = laneBtn.closest('.slot');
        if (!laneSlot) return;
        var laneTeam = laneSlot.getAttribute('data-team');
        var laneIdx = Number(laneSlot.getAttribute('data-slot-index'));
        if (laneTeam !== 'ally') return;
        if (Number.isNaN(laneIdx)) return;
        e.preventDefault();
        e.stopPropagation();
        self.showLanePopover(laneTeam, laneIdx, laneBtn);
        return;
      }

      var removeBtn = e.target.closest('[data-action="remove-slot"]');
      if (removeBtn) {
        var slotEl = removeBtn.closest('.slot');
        if (!slotEl) return;
        var teamKey = slotEl.getAttribute('data-team');
        var idx = Number(slotEl.getAttribute('data-slot-index'));
        if (TEAM_KEYS.indexOf(teamKey) === -1) return;
        if (Number.isNaN(idx)) return;
        self.remove(teamKey, idx);
        return;
      }

      var slotPick = e.target.closest('.slot');
      if (!slotPick) return;
      var pickTeam = slotPick.getAttribute('data-team');
      var pickIdx = Number(slotPick.getAttribute('data-slot-index'));
      if (pickTeam !== 'ally') return;
      if (Number.isNaN(pickIdx)) return;
      self.setUserSlotIndex(pickIdx);
    });

    document.addEventListener('click', function (e) {
      if (!self.lanePopover || self.lanePopover.hidden) return;
      if (self.lanePopover.contains(e.target)) return;
      if (e.target.closest('[data-action="set-lane"]')) return;
      self.hideLanePopover();
    });

    if (this.nodes.resetBtn) {
      this.nodes.resetBtn.addEventListener('click', function () {
        self.reset();
      });
    }
  };

  DraftPickApp.prototype.syncPickTargetButtons = function () {
    if (!this.nodes || !this.nodes.pickTargetButtons) return;

    var locked = Boolean(this.state.autoDraftOrder);

    for (var i = 0; i < this.nodes.pickTargetButtons.length; i++) {
      var btn = this.nodes.pickTargetButtons[i];
      var teamKey = btn.getAttribute('data-pick-target');
      var active = teamKey === this.state.pickTarget;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.disabled = locked;
      btn.setAttribute('aria-disabled', locked ? 'true' : 'false');
    }
  };

  DraftPickApp.prototype.syncRoleTabs = function () {
    if (!this.nodes || !this.nodes.roleTabs) return;

    for (var i = 0; i < this.nodes.roleTabs.length; i++) {
      var btn = this.nodes.roleTabs[i];
      var value = btn.getAttribute('data-role-filter');
      var active = value === this.state.role;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  };

  DraftPickApp.prototype.heroById = function (heroId) {
    for (var i = 0; i < this.heroes.length; i++) {
      if (this.heroes[i].id === heroId) return this.heroes[i];
    }
    return null;
  };

  DraftPickApp.prototype.isPicked = function (heroId) {
    return Boolean(this.state.pickedById[heroId]);
  };

  DraftPickApp.prototype.nextEmptySlot = function (teamKey) {
    var picks = this.state.teams[teamKey];
    for (var i = 0; i < picks.length; i++) {
      if (!picks[i]) return i;
    }
    return -1;
  };

  DraftPickApp.prototype.pick = function (heroId, options) {
    var hero = this.heroById(heroId);
    if (!hero) return;

    if (this.isPicked(heroId)) {
      this.setMessage('Hero sudah dipilih.');
      return;
    }

    var opts = options || {};
    var source = opts.source || 'grid';

    if (this.state.autoDraftOrder) {
      this.applyAutoDraftOrder();

      var expectedTeam = this.autoDraftNextTarget();
      if (source === 'recommendation' && expectedTeam && expectedTeam !== 'ally') {
        this.setMessage('Auto Order aktif: sekarang giliran Tim Musuh.');
        return;
      }
    }

    var teamKey = (source === 'recommendation') ? this.recommendationsTeamKey() : this.state.pickTarget;

    var idx = this.nextEmptySlot(teamKey);
    if (idx === -1) {
      this.setMessage('Slot ' + TEAM_LABELS[teamKey] + ' sudah penuh.');
      return;
    }

    this.state.teams[teamKey][idx] = hero;
    this.state.pickedById[heroId] = { team: teamKey, slotIndex: idx };
    this.state.draftStarted = true;

    if (source === 'recommendation' && teamKey === 'ally') {
      this.state.userSlotIndex = idx;

      var lane = normalizeRole(hero.role);
      if (!normalizeRole(this.state.userLane) && LANE_ROLES.indexOf(lane) !== -1) {
        this.state.userLane = lane;
      }

      if (LANE_ROLES.indexOf(normalizeRole(this.state.userLane)) !== -1) {
        this.state.recommendationLane = normalizeRole(this.state.userLane);
      }
    }

    this.setMessage('Memilih ' + hero.name + ' untuk ' + TEAM_LABELS[teamKey] + '.');

    if (this.state.autoDraftOrder) {
      this.applyAutoDraftOrder();
    }

    this.render();
  };

  DraftPickApp.prototype.remove = function (teamKey, idx) {
    var hero = this.state.teams[teamKey][idx];
    if (!hero) return;

    this.state.teams[teamKey][idx] = null;
    delete this.state.pickedById[hero.id];

    if (this.state.autoDraftOrder) {
      this.applyAutoDraftOrder();
    }

    this.setMessage('Menghapus ' + hero.name + ' dari ' + TEAM_LABELS[teamKey] + '.');

    this.render();
  };

  DraftPickApp.prototype.reset = function () {
    this.state.mode = 'solo';
    this.state.pickTarget = 'ally';
    this.state.autoDraftOrder = false;
    this.state.firstPickTeam = null;
    this.state.draftStarted = false;
    this.state.advancedRecommendations = false;
    this.state.search = '';
    this.state.role = 'All';
    this.state.recommendationLane = null;
    this.state.userSlotIndex = 0;
    this.state.userLane = '';
    this.state.pickedById = {};

    TEAM_KEYS.forEach(function (teamKey) {
      for (var i = 0; i < this.state.teams[teamKey].length; i++) {
        this.state.teams[teamKey][i] = null;
      }
    }, this);

    if (this.state.laneOverrides && this.state.laneOverrides.ally) {
      for (var j = 0; j < this.state.laneOverrides.ally.length; j++) {
        this.state.laneOverrides.ally[j] = '';
      }
    }

    if (this.nodes.searchInput) this.nodes.searchInput.value = '';
    if (this.nodes.roleSelect) this.nodes.roleSelect.value = 'All';

    this.hideLanePopover();
    this.setMessage('Reset selesai.');
    this.render();
  };

  DraftPickApp.prototype.renderRoleOptions = function () {
    if (!this.nodes || !this.nodes.roleSelect) return;

    // Fixed options to match requested lane roles.
    var roles = ['All'].concat(LANE_ROLES);

    this.nodes.roleSelect.innerHTML = '';
    for (var i = 0; i < roles.length; i++) {
      var opt = el('option', { value: roles[i], text: roles[i] });
      if (roles[i] === this.state.role) opt.selected = true;
      this.nodes.roleSelect.appendChild(opt);
    }
  };

  DraftPickApp.prototype.filteredHeroes = function () {
    var search = (this.state.search || '').trim();
    var role = this.state.role;

    return this.heroes.filter(function (hero) {
      if (role && role !== 'All' && !heroCanPlayLane(hero, role)) return false;

      if (!search) return true;

      if (containsIgnoreCase(hero.name, search)) return true;
      if (containsIgnoreCase(hero.role, search)) return true;
      for (var i = 0; i < hero.tags.length; i++) {
        if (containsIgnoreCase(hero.tags[i], search)) return true;
      }
      return false;
    });
  };

  DraftPickApp.prototype.renderGrid = function () {
    if (!this.nodes || !this.nodes.heroGrid) return;

    var heroes = this.filteredHeroes();

    this.nodes.heroGrid.innerHTML = '';

    var frag = document.createDocumentFragment();

    for (var i = 0; i < heroes.length; i++) {
      var hero = heroes[i];
      var picked = this.isPicked(hero.id);

      var btn = el('button', {
        className: 'hero-card',
        type: 'button',
        'data-hero-id': hero.id,
        title: hero.role + ' • ' + hero.tags.join(', ')
      });

      if (picked) {
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
      }

      var thumb = el('div', { className: 'hero-card__thumb' });
      // Gradient overlay (optional url); avoid 404 spam if image is missing.
      thumb.style.backgroundImage = heroThumbBackground(hero.image);

      btn.appendChild(thumb);
      btn.appendChild(el('div', { className: 'hero-card__name', text: hero.name }));

      frag.appendChild(btn);
    }

    this.nodes.heroGrid.appendChild(frag);
  };

  DraftPickApp.prototype.renderTeams = function () {
    if (!this.nodes || !this.nodes.slotEls) return;

    var self = this;

    TEAM_KEYS.forEach(function (teamKey) {
      var slots = self.nodes.slotEls[teamKey];
      if (!slots || slots.length === 0) return;

      for (var i = 0; i < slots.length; i++) {
        var slotEl = slots[i];
        var hero = self.state.teams[teamKey][i] || null;

        var isUserSlot = self.state.mode === 'solo' && teamKey === 'ally' && i === self.state.userSlotIndex;
        slotEl.classList.toggle('is-user', isUserSlot);

        var labelWrap = slotEl.querySelector('.slot__label');
        var labelTextEl = slotEl.querySelector('.slot__label-text');
        var badgeEl = slotEl.querySelector('.slot__badge');
        var laneBtn = slotEl.querySelector('.slot__lane');

        var valueEl = slotEl.querySelector('.slot__value');
        var avatarEl = slotEl.querySelector('.slot__avatar');
        var removeBtn = slotEl.querySelector('[data-action="remove-slot"]');

        if (labelTextEl) {
          labelTextEl.textContent = 'Slot ' + (i + 1);
        } else if (labelWrap) {
          labelWrap.textContent = 'Slot ' + (i + 1);
        }

        if (badgeEl) badgeEl.textContent = isUserSlot ? 'P1' : '';

        if (laneBtn) {
          var laneText = '--';
          if (teamKey === 'ally') laneText = laneCode(self.laneForAllySlot(i));
          laneBtn.textContent = laneText;
        }

        if (hero) {
          slotEl.setAttribute('data-hero-id', hero.id);
          if (valueEl) valueEl.textContent = hero.name;
          if (avatarEl) avatarEl.style.backgroundImage = heroThumbBackground(hero.image);
          if (removeBtn) removeBtn.disabled = false;
        } else {
          slotEl.removeAttribute('data-hero-id');
          if (valueEl) valueEl.textContent = 'Empty';
          if (avatarEl) avatarEl.style.backgroundImage = '';
          if (removeBtn) removeBtn.disabled = true;
        }
      }
    });
  };

  DraftPickApp.prototype.availableHeroes = function () {
    var self = this;
    return this.heroes.filter(function (h) { return !self.isPicked(h.id); });
  };

  DraftPickApp.prototype.renderRecommendations = function () {
    if (!this.nodes || !this.nodes.recommendationsList) return;

    var teamKey = this.recommendationsTeamKey();
    var enemyKey = teamKey === 'ally' ? 'enemy' : 'ally';

    var laneAssignments = teamKey === 'ally' ? this.allyLaneAssignments() : null;
    var summary = computeTeamSummary(this.state.teams[teamKey], laneAssignments);
    var enemyPicks = this.state.teams[enemyKey];

    var teamPickCount = (summary.pickedHeroes || []).length;
    var enemyPickCount = pickedHeroesFromTeam(enemyPicks).length;

    var draftMode = null;
    var modeLabel = '';

    if (enemyPickCount === 0) {
      if (teamPickCount === 0) {
        draftMode = 'BLIND_FIRST_PICK';
        modeLabel = 'Blind (First Pick)';
      } else {
        draftMode = 'BLIND_COMPLETION';
        modeLabel = 'Blind (Completion)';
      }
    } else {
      draftMode = 'ENEMY_INFO_AVAILABLE';
      modeLabel = 'Info musuh';
    }



    var activeTab = this.state.recommendationLane;
    if (!isValidRecTab(activeTab)) {
      var preferredLane = '';
      if (teamKey === 'ally') {
        preferredLane = normalizeRole(this.laneForAllySlot(this.state.userSlotIndex));
      }

      if (LANE_ROLES.indexOf(preferredLane) !== -1) {
        activeTab = preferredLane;
      } else {
        activeTab = REC_TAB_SMART;
      }
      this.state.recommendationLane = activeTab;
    }

    var scored = [];

    if (draftMode === 'BLIND_FIRST_PICK') {
      scored = computeBlindFirstPickTop(this.availableHeroes(), activeTab);
    } else {
      var enemyForScoring = (draftMode === 'BLIND_COMPLETION') ? [] : enemyPicks;

      var pool = this.availableHeroes();

      if (activeTab === REC_TAB_SMART) {
        scored = computeSmartTop(pool, summary, enemyForScoring);
      } else {
      if (activeTab !== REC_TAB_SMART) {
        pool = pool.filter(function (h) { return heroCanPlayLane(h, activeTab); });
      }

      scored = pool.map(function (hero) {
        var s = scoreHeroForTeam(hero, summary, enemyForScoring, activeTab);
        var reasons = s.reasons;

        // Keep flex info visible in lane tab.
        if (heroIsSecondaryLane(hero, activeTab)) {
          reasons = reasons.slice();
          reasons.push('Flex: bisa main ' + activeTab);
        }

        return {
          hero: hero,
          score: s.score,
          reasons: reasons
        };
      });

      scored.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.hero.name.localeCompare(b.hero.name);
      });

      scored = scored.slice(0, 5);
    }

    }

    if (this.nodes.recommendationsTitle) {
      this.nodes.recommendationsTitle.textContent = 'Rekomendasi Pick — ' + TEAM_LABELS[teamKey] + ' • Mode: ' + modeLabel;
    }

    if (this.nodes.recommendationsArchetype) {
      var badge = '';
      if (teamPickCount > 0 && summary.archetypeSignals) {
        var primaryArchetype = summary.archetypeSignals.primary;
        var primaryScore = summary.archetypeSignals.primaryScore;

        var shortLabel = null;
        if (primaryArchetype === 'frontToBack') shortLabel = 'F2B';
        else if (primaryArchetype === 'pick') shortLabel = 'Pick';
        else if (primaryArchetype === 'dive') shortLabel = 'Dive';

        if (shortLabel) {
          badge = 'Archetype: ' + shortLabel + ' (' + primaryScore + '/3)';
        }
      }
      this.nodes.recommendationsArchetype.textContent = badge;
    }

    this.nodes.recommendationsList.innerHTML = '';

    var tabs = el('div', { className: 'rec-lane-tabs', role: 'tablist', 'aria-label': 'Rekomendasi lane' });

    var smartTab = el('button', {
      className: 'rec-lane-tab' + (activeTab === REC_TAB_SMART ? ' is-active' : ''),
      type: 'button',
      'data-action': 'rec-lane',
      'data-rec-lane': REC_TAB_SMART
    });
    smartTab.textContent = 'Smart';
    smartTab.setAttribute('aria-pressed', activeTab === REC_TAB_SMART ? 'true' : 'false');
    tabs.appendChild(smartTab);

    for (var t = 0; t < LANE_ROLES.length; t++) {
      var laneName = LANE_ROLES[t];
      var isActive = laneName === activeTab;
      var tab = el('button', {
        className: 'rec-lane-tab' + (isActive ? ' is-active' : ''),
        type: 'button',
        'data-action': 'rec-lane',
        'data-rec-lane': laneName
      });
      tab.textContent = laneName;
      tab.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      tabs.appendChild(tab);
    }

    if (this.nodes.recommendationsNav) {
      this.nodes.recommendationsNav.innerHTML = '';
      this.nodes.recommendationsNav.appendChild(tabs);
    }

    scored = scored.slice(0, 5);

    if (scored.length === 0) {
      this.nodes.recommendationsList.appendChild(el('div', { className: 'rec-empty', text: 'Tidak ada hero tersedia.' }));
      return;
    }

    var strip = el('div', { className: 'rec-strip' });

    for (var j = 0; j < scored.length; j++) {
      var item = scored[j];

      var card = el('button', {
        className: 'rec-card',
        type: 'button',
        'data-hero-id': item.hero.id,
        title: item.reasons.join(' • ')
      });

      var thumb = el('img', { 
        className: 'rec-card__thumb',
        src: item.hero.image,
        alt: item.hero.name
      });

      var content = el('div', { className: 'rec-card__content' });
      content.appendChild(el('div', { className: 'rec-card__name', text: item.hero.name }));
      content.appendChild(el('div', { className: 'rec-card__meta', text: item.hero.role }));
      content.appendChild(el('div', { className: 'rec-card__score', text: 'Skor ' + item.score }));

      var extra = el('div', { className: 'rec-card__extra' });
      var tags = el('div', { className: 'rec-card__tags' });
      var maxTags = Math.min(4, item.reasons.length);
      for (var c = 0; c < maxTags; c++) {
        tags.appendChild(el('span', { className: 'rec-card__tag', text: compactReason(item.reasons[c]) }));
      }
      extra.appendChild(tags);

      card.appendChild(thumb);
      card.appendChild(content);
      card.appendChild(extra);

      this.nodes.recommendationsList.appendChild(card);
    }
  };

  DraftPickApp.prototype.render = function () {
    this.syncPickTargetButtons();
    this.syncAutoOrderButton();
    this.syncModeButtons();
    this.syncAdvancedButton();
    this.syncRoleTabs();
    this.renderTeams();
    this.renderGrid();
    this.renderRecommendations();
  };

  // Small public API.
  window.CoachDraftPick = {
    HEROES: HEROES,
    DatabaseHero: window.DatabaseHero || null,
    __test: {
      computeBlindFirstPickTop: computeBlindFirstPickTop,
      computeSmartTop: computeSmartTop,
      scoreHeroForFirstPick: scoreHeroForFirstPick,
      computeTeamSummary: computeTeamSummary,
      scoreHeroForTeam: scoreHeroForTeam,
      FIRST_PICK_WEIGHTS: FIRST_PICK_WEIGHTS,
      AUTO_DRAFT_PATTERN: AUTO_DRAFT_PATTERN
    },
    create: function (options) {
      return new DraftPickApp(options);
    }
  };

  function autoMount() {
    var app = new DraftPickApp();
    app.mount();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }
})();
