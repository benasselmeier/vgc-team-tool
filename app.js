const TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const TYPE_CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

const SAMPLE_TEAM = [
  {
    pokemon: "Incineroar",
    ability: "Intimidate",
    moves: ["Fake Out", "Flare Blitz", "Parting Shot", "Knock Off"],
  },
  {
    pokemon: "Amoonguss",
    ability: "Regenerator",
    moves: ["Spore", "Rage Powder", "Pollen Puff", "Clear Smog"],
  },
  {
    pokemon: "Flutter Mane",
    ability: "Protosynthesis",
    moves: ["Moonblast", "Shadow Ball", "Icy Wind", "Protect"],
  },
  {
    pokemon: "Urshifu Rapid Strike",
    ability: "Unseen Fist",
    moves: ["Surging Strikes", "Close Combat", "Aqua Jet", "Protect"],
  },
  {
    pokemon: "Rillaboom",
    ability: "Grassy Surge",
    moves: ["Fake Out", "Wood Hammer", "Grassy Glide", "U-turn"],
  },
  {
    pokemon: "Kingambit",
    ability: "Defiant",
    moves: ["Kowtow Cleave", "Iron Head", "Sucker Punch", "Protect"],
  },
];

const POKE_API = "https://pokeapi.co/api/v2";
const team = Array.from({ length: 6 }, () => ({ pokemon: "", ability: "", moves: ["", "", "", ""] }));
const pokemonCache = new Map();
const moveCache = new Map();
let pendingSave = null;

const elements = {
  teamGrid: document.querySelector("#teamGrid"),
  teamStatus: document.querySelector("#teamStatus"),
  threatList: document.querySelector("#threatList"),
  mostCoverageList: document.querySelector("#mostCoverageList"),
  leastCoverageList: document.querySelector("#leastCoverageList"),
  defenseMatrix: document.querySelector("#defenseMatrix"),
  suggestions: document.querySelector("#suggestions"),
  template: document.querySelector("#pokemonCardTemplate"),
  teamPaste: document.querySelector("#teamPaste"),
  importButton: document.querySelector("#importButton"),
  exportButton: document.querySelector("#exportButton"),
  loadSampleButton: document.querySelector("#loadSampleButton"),
  clearButton: document.querySelector("#clearButton"),
};

function normalizeName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.']/g, "")
    .replace(/\s+/g, "-");
}

function titleCase(value) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace("Urshifu Rapid Strike", "Urshifu Rapid Strike")
    .replace("Mr Mime", "Mr. Mime");
}

function typeBadge(type) {
  const span = document.createElement("span");
  span.className = `type-badge type-${type}`;
  span.textContent = type;
  return span;
}

function moveTypeBadge(type) {
  if (!type) {
    const span = document.createElement("span");
    span.className = "empty-state";
    span.textContent = "";
    return span;
  }
  return typeBadge(type);
}

function getTypeMultiplier(attackType, defenderTypes) {
  return defenderTypes.reduce((total, defenderType) => {
    const modifier = TYPE_CHART[attackType]?.[defenderType] ?? 1;
    return total * modifier;
  }, 1);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function pokemonApiName(name) {
  const normalized = normalizeName(name);
  const regionalPrefixes = {
    alolan: "alola",
    galarian: "galar",
    hisuian: "hisui",
    paldean: "paldea",
  };
  const aliases = {
    "urshifu-rapid-strike": "urshifu-rapid-strike",
    "urshifu-rapid-strike-style": "urshifu-rapid-strike",
    "urshifu-single-strike": "urshifu-single-strike",
    "indeedee-f": "indeedee-female",
    "indeedee-female": "indeedee-female",
    "ogerpon-wellspring": "ogerpon-wellspring-mask",
    "ogerpon-hearthflame": "ogerpon-hearthflame-mask",
    "ogerpon-cornerstone": "ogerpon-cornerstone-mask",
    "tornadus-incarnate": "tornadus-incarnate",
    "landorus-incarnate": "landorus-incarnate",
    "thundurus-incarnate": "thundurus-incarnate",
    "calyrex-shadow": "calyrex-shadow-rider",
    "calyrex-ice": "calyrex-ice-rider",
    "chien-pao": "chien-pao",
    "chi-yu": "chi-yu",
    "ting-lu": "ting-lu",
    "wo-chien": "wo-chien",
  };
  const regionalMatch = normalized.match(/^(alolan|galarian|hisuian|paldean)-(.+)$/);
  if (regionalMatch) {
    return `${regionalMatch[2]}-${regionalPrefixes[regionalMatch[1]]}`;
  }
  return aliases[normalized] ?? normalized;
}

async function getPokemon(name) {
  const apiName = pokemonApiName(name);
  if (!apiName) return null;
  if (pokemonCache.has(apiName)) return pokemonCache.get(apiName);

  const promise = fetchJson(`${POKE_API}/pokemon/${apiName}`).then((data) => ({
    name: titleCase(data.name),
    types: data.types.map((entry) => entry.type.name),
    sprite:
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default ||
      "",
  }));

  pokemonCache.set(apiName, promise);
  return promise;
}

async function getMove(name) {
  const apiName = normalizeName(name);
  if (!apiName) return null;
  if (moveCache.has(apiName)) return moveCache.get(apiName);

  const promise = fetchJson(`${POKE_API}/move/${apiName}`).then((data) => ({
    name: titleCase(data.name),
    type: data.type.name,
    damageClass: data.damage_class.name,
  }));

  moveCache.set(apiName, promise);
  return promise;
}

function saveTeam() {
  window.clearTimeout(pendingSave);
  pendingSave = window.setTimeout(() => {
    localStorage.setItem("vgc-team-tool", JSON.stringify(team));
  }, 100);
}

function loadStoredTeam() {
  try {
    const stored = JSON.parse(localStorage.getItem("vgc-team-tool") || "null");
    if (!Array.isArray(stored)) return;
    stored.slice(0, 6).forEach((slot, index) => {
      team[index] = {
        pokemon: slot.pokemon || "",
        ability: slot.ability || "",
        moves: Array.from({ length: 4 }, (_, moveIndex) => slot.moves?.[moveIndex] || ""),
      };
    });
  } catch {
    localStorage.removeItem("vgc-team-tool");
  }
}

function renderTeam() {
  elements.teamGrid.innerHTML = "";
  team.forEach((slot, index) => {
    const card = elements.template.content.firstElementChild.cloneNode(true);
    card.dataset.index = index;
    card.querySelector(".slot-number").textContent = index + 1;

    const pokemonInput = card.querySelector(".pokemon-input");
    pokemonInput.value = slot.pokemon;
    pokemonInput.addEventListener("change", () => updatePokemon(index, pokemonInput.value));
    pokemonInput.addEventListener("blur", () => updatePokemon(index, pokemonInput.value));

    const abilityInput = card.querySelector(".ability-input");
    abilityInput.value = slot.ability;
    abilityInput.addEventListener("input", () => {
      team[index].ability = abilityInput.value;
      saveTeam();
    });

    const moves = card.querySelector(".moves");
    slot.moves.forEach((move, moveIndex) => {
      const row = document.createElement("div");
      row.className = "move-row";

      const label = document.createElement("label");
      label.textContent = `Move ${moveIndex + 1}`;
      const input = document.createElement("input");
      input.type = "text";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.placeholder = moveIndex === 0 ? "Protect" : "Move name";
      input.value = move;
      input.addEventListener("change", () => updateMove(index, moveIndex, input.value));
      input.addEventListener("blur", () => updateMove(index, moveIndex, input.value));
      label.append(input);

      const moveTypes = document.createElement("div");
      moveTypes.className = "move-types";
      row.append(label, moveTypes);
      moves.append(row);
    });

    elements.teamGrid.append(card);
    hydrateCard(index);
  });
}

async function hydrateCard(index) {
  const card = getCard(index);
  const slot = team[index];
  const typeRow = card.querySelector(".pokemon-types");
  const message = card.querySelector(".card-message");
  const sprite = card.querySelector(".sprite");

  typeRow.innerHTML = "";
  message.textContent = "";
  sprite.removeAttribute("src");

  if (slot.pokemon.trim()) {
    message.textContent = "Loading Pokemon...";
    try {
      const pokemon = await getPokemon(slot.pokemon);
      slot.meta = pokemon;
      typeRow.replaceChildren(...pokemon.types.map(typeBadge));
      sprite.src = pokemon.sprite;
      sprite.alt = `${pokemon.name} artwork`;
      message.textContent = "";
    } catch {
      slot.meta = null;
      message.textContent = "Pokemon not found. Try the official form name.";
    }
  } else {
    slot.meta = null;
  }

  await Promise.all(slot.moves.map((move, moveIndex) => hydrateMove(index, moveIndex)));
  analyzeTeam();
}

async function hydrateMove(index, moveIndex) {
  const card = getCard(index);
  const slot = team[index];
  const typeContainer = card.querySelectorAll(".move-types")[moveIndex];
  typeContainer.innerHTML = "";
  typeContainer.classList.remove("status-move");

  if (!slot.moves[moveIndex].trim()) {
    slot.moveMeta = slot.moveMeta || [];
    slot.moveMeta[moveIndex] = null;
    return;
  }

  try {
    const move = await getMove(slot.moves[moveIndex]);
    slot.moveMeta = slot.moveMeta || [];
    slot.moveMeta[moveIndex] = move;
    typeContainer.classList.toggle("status-move", move.damageClass === "status");
    typeContainer.replaceChildren(moveTypeBadge(move.type));
  } catch {
    slot.moveMeta = slot.moveMeta || [];
    slot.moveMeta[moveIndex] = null;
    const span = document.createElement("span");
    span.className = "empty-state";
    span.textContent = "?";
    typeContainer.append(span);
  }
}

function getCard(index) {
  return elements.teamGrid.querySelector(`[data-index="${index}"]`);
}

function updatePokemon(index, value) {
  team[index].pokemon = value.trim();
  saveTeam();
  hydrateCard(index);
}

function updateMove(index, moveIndex, value) {
  team[index].moves[moveIndex] = value.trim();
  saveTeam();
  hydrateMove(index, moveIndex).then(analyzeTeam);
}

function analyzeTeam() {
  const loadedPokemon = team.filter((slot) => slot.meta?.types?.length);
  const loadedMoves = team.flatMap((slot) => slot.moveMeta || []).filter((move) => move?.type);
  const attackingMoves = loadedMoves.filter((move) => move.damageClass !== "status");

  elements.teamStatus.textContent = `${loadedPokemon.length} / 6 loaded`;

  const defensiveRows = TYPES.map((attackType) => {
    const multipliers = loadedPokemon.map((slot) => getTypeMultiplier(attackType, slot.meta.types));
    const weak = multipliers.filter((value) => value > 1).length;
    const resist = multipliers.filter((value) => value < 1).length;
    const immune = multipliers.filter((value) => value === 0).length;
    const total = multipliers.reduce((sum, value) => sum + value, 0);
    return { type: attackType, weak, resist, immune, total };
  });

  const offensiveRows = TYPES.map((defenderType) => {
    const superEffectiveMoves = attackingMoves.filter((move) => getTypeMultiplier(move.type, [defenderType]) > 1);
    return {
      type: defenderType,
      count: superEffectiveMoves.length,
      sources: [...new Set(superEffectiveMoves.map((move) => move.type))],
    };
  });

  renderThreats(defensiveRows, loadedPokemon.length);
  renderCoverage(offensiveRows, attackingMoves.length);
  renderMatrix(defensiveRows, loadedPokemon.length);
  renderSuggestions(defensiveRows, offensiveRows, loadedPokemon.length, loadedMoves.length - attackingMoves.length);
}

function renderThreats(rows, teamSize) {
  const threats = rows
    .filter((row) => row.weak >= Math.max(3, Math.ceil(teamSize / 2)))
    .sort((a, b) => b.weak - a.weak || b.total - a.total)
    .slice(0, 6);

  if (!threats.length) {
    elements.threatList.className = "type-list empty-state";
    elements.threatList.textContent = teamSize ? "No major shared weakness stands out yet." : "Add Pokemon to calculate team weaknesses.";
    return;
  }

  elements.threatList.className = "type-list";
  elements.threatList.replaceChildren(...threats.map((row) => scoreChip(row.type, `${row.weak} weak`)));
}

function renderCoverage(rows, attackingMoveCount) {
  if (!attackingMoveCount) {
    elements.mostCoverageList.className = "type-list empty-state";
    elements.mostCoverageList.textContent = "Add attacking moves to calculate strongest coverage.";
    elements.leastCoverageList.className = "type-list empty-state";
    elements.leastCoverageList.textContent = "Add attacking moves to find types with fewer than two coverage lines.";
    return;
  }

  const mostCovered = rows
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type))
    .slice(0, 6);
  const leastCovered = rows
    .filter((row) => row.count < 2)
    .sort((a, b) => a.count - b.count || a.type.localeCompare(b.type));

  if (!mostCovered.length) {
    elements.mostCoverageList.className = "type-list empty-state";
    elements.mostCoverageList.textContent = "No super-effective damaging coverage found yet.";
  } else {
    elements.mostCoverageList.className = "type-list";
    elements.mostCoverageList.replaceChildren(
      ...mostCovered.map((row) => scoreChip(row.type, `${row.count} ${row.count === 1 ? "hit" : "hits"}`)),
    );
  }

  if (!leastCovered.length) {
    elements.leastCoverageList.className = "type-list empty-state";
    elements.leastCoverageList.textContent = "Every single type has at least two super-effective damaging lines.";
    return;
  }

  elements.leastCoverageList.className = "type-list";
  elements.leastCoverageList.replaceChildren(
    ...leastCovered.map((row) => scoreChip(row.type, `${row.count} ${row.count === 1 ? "hit" : "hits"}`)),
  );
}

function scoreChip(type, score) {
  const chip = document.createElement("div");
  chip.className = "type-score";
  chip.append(typeBadge(type));

  const value = document.createElement("span");
  value.className = "score-value";
  value.textContent = score;
  chip.append(value);

  return chip;
}

function renderMatrix(rows, teamSize) {
  if (!teamSize) {
    elements.defenseMatrix.className = "matrix empty-state";
    elements.defenseMatrix.textContent = "Add Pokemon to see incoming type pressure.";
    return;
  }

  elements.defenseMatrix.className = "matrix";
  elements.defenseMatrix.replaceChildren(
    ...rows
      .slice()
      .sort((a, b) => b.weak - a.weak || b.total - a.total)
      .map((row) => {
        const item = document.createElement("div");
        item.className = "matrix-row";
        const badge = typeBadge(row.type);
        const bar = document.createElement("div");
        bar.className = "matrix-bar";
        const fill = document.createElement("div");
        fill.className = "matrix-fill";
        fill.style.width = `${Math.min(100, (row.weak / Math.max(teamSize, 1)) * 100)}%`;
        if (row.weak >= 3) fill.style.background = "var(--accent-2)";
        if (row.weak === 0) fill.style.background = "var(--good)";
        bar.append(fill);

        const value = document.createElement("span");
        value.className = "matrix-value";
        value.textContent = `${row.weak}/${teamSize}`;
        item.append(badge, bar, value);
        return item;
      }),
  );
}

function renderSuggestions(defensiveRows, offensiveRows, teamSize, statusMoveCount) {
  const suggestions = [];
  const bigThreats = defensiveRows
    .filter((row) => row.weak >= Math.max(3, Math.ceil(teamSize / 2)))
    .sort((a, b) => b.weak - a.weak)
    .map((row) => row.type);
  const thinCoverage = offensiveRows.filter((row) => row.count < 2);
  const uncovered = thinCoverage.filter((row) => row.count === 0).map((row) => row.type);
  const singleCovered = thinCoverage.filter((row) => row.count === 1).map((row) => row.type);
  const immunities = defensiveRows.filter((row) => row.immune > 0).map((row) => row.type);

  if (teamSize < 3) {
    suggestions.push("Add at least three Pokemon before drawing strong conclusions.");
  }

  if (bigThreats.length) {
    suggestions.push(`Your team matches up poorly vs. ${formatTypeList(bigThreats)} attacks based on shared weaknesses.`);
  }

  if (uncovered.length <= 5 && uncovered.length > 0) {
    suggestions.push(`Your team could struggle to hit ${formatTypeList(uncovered)} Pokemon super effectively with its current damaging moves.`);
  } else if (uncovered.length > 5) {
    suggestions.push("Your offensive coverage is still developing. Add more attacking moves before relying on the coverage readout.");
  }

  if (singleCovered.length > 0 && singleCovered.length <= 6) {
    suggestions.push(`Your team only has one super-effective damaging line into ${formatTypeList(singleCovered)}, so those matchups may depend on a single Pokemon staying available.`);
  } else if (singleCovered.length > 6) {
    suggestions.push("Several types are covered by only one damaging line. Aim for 2-3 ways to pressure the types you expect to face most.");
  }

  if (statusMoveCount > 0) {
    suggestions.push(`${statusMoveCount} non-damaging ${statusMoveCount === 1 ? "move is" : "moves are"} excluded from offensive coverage.`);
  }

  if (immunities.length) {
    suggestions.push(`You have at least one immunity into ${formatTypeList(immunities)}, which can create useful switch options.`);
  }

  if (!suggestions.length) {
    suggestions.push("The current team has no obvious type-stack warning from this objective pass.");
  }

  elements.suggestions.replaceChildren(
    ...suggestions.map((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }),
  );
}

function formatTypeList(types) {
  return types.map(titleCase).join(", ");
}

function loadSampleTeam() {
  SAMPLE_TEAM.forEach((slot, index) => {
    team[index] = {
      pokemon: slot.pokemon,
      ability: slot.ability,
      moves: [...slot.moves],
    };
  });
  saveTeam();
  renderTeam();
}

function clearTeam() {
  team.forEach((slot, index) => {
    team[index] = { pokemon: "", ability: "", moves: ["", "", "", ""] };
  });
  localStorage.removeItem("vgc-team-tool");
  elements.teamPaste.value = "";
  renderTeam();
  analyzeTeam();
}

function parseTeamPaste(text) {
  return text
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((block) => {
      const lines = block
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .filter(Boolean);
      const header = lines[0] || "";
      const headerWithoutItem = header.replace(/\s*@.*$/, "").trim();
      const parentheticalSpecies = [...headerWithoutItem.matchAll(/\(([^)]+)\)/g)]
        .map((match) => match[1].trim())
        .filter((value) => !/^[mf]$/i.test(value))
        .pop();
      const pokemon = parentheticalSpecies || headerWithoutItem.replace(/\s*\([mf]\)\s*$/i, "").trim();
      const abilityLine = lines.find((line) => /^ability:/i.test(line));
      const moves = lines
        .filter((line) => /^[-*]\s+/.test(line))
        .map((line) => line.replace(/^[-*]\s+/, "").trim())
        .slice(0, 4);

      return {
        pokemon,
        ability: abilityLine ? abilityLine.replace(/^ability:\s*/i, "").trim() : "",
        moves: Array.from({ length: 4 }, (_, index) => moves[index] || ""),
      };
    });
}

function importPaste() {
  const parsed = parseTeamPaste(elements.teamPaste.value);
  if (!parsed.length) return;

  team.forEach((slot, index) => {
    team[index] = parsed[index] || { pokemon: "", ability: "", moves: ["", "", "", ""] };
  });
  saveTeam();
  renderTeam();
}

function exportTeam() {
  const text = team
    .filter((slot) => slot.pokemon || slot.ability || slot.moves.some(Boolean))
    .map((slot) => {
      const lines = [slot.pokemon || "Unknown"];
      if (slot.ability) lines.push(`Ability: ${slot.ability}`);
      slot.moves.filter(Boolean).forEach((move) => lines.push(`- ${move}`));
      return lines.join("\n");
    })
    .join("\n\n");
  elements.teamPaste.value = text;
  elements.teamPaste.focus();
  elements.teamPaste.select();
}

elements.importButton.addEventListener("click", importPaste);
elements.exportButton.addEventListener("click", exportTeam);
elements.loadSampleButton.addEventListener("click", loadSampleTeam);
elements.clearButton.addEventListener("click", clearTeam);

loadStoredTeam();
renderTeam();
analyzeTeam();
