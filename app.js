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

const STAT_LABELS = {
  hp: "HP",
  attack: "Atk",
  defense: "Def",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "Spe",
};

const HEALING_MOVES = new Set([
  "draining-kiss",
  "floral-healing",
  "heal-order",
  "heal-pulse",
  "healing-wish",
  "horn-leech",
  "leech-life",
  "milk-drink",
  "moonlight",
  "morning-sun",
  "pollen-puff",
  "recover",
  "roost",
  "shore-up",
  "slack-off",
  "soft-boiled",
  "strength-sap",
  "synthesis",
  "wish",
]);

const PRIORITY_ANALYSIS_IGNORES = new Set(["protect"]);

const SOUND_MOVES = new Set([
  "alluring-voice",
  "boomburst",
  "bug-buzz",
  "chatter",
  "clangorous-soul",
  "clangorous-soulblaze",
  "clanging-scales",
  "confide",
  "disarming-voice",
  "echoed-voice",
  "eerie-spell",
  "grass-whistle",
  "growl",
  "heal-bell",
  "hyper-voice",
  "metal-sound",
  "noble-roar",
  "overdrive",
  "parting-shot",
  "perish-song",
  "psychic-noise",
  "relic-song",
  "roar",
  "round",
  "screech",
  "sing",
  "snarl",
  "snore",
  "sparkling-aria",
  "sparkly-swirl",
  "supersonic",
  "torch-song",
  "uproar",
]);

const RAGING_BULL_TYPES = {
  "tauros-paldea-combat-breed": "fighting",
  "paldean-tauros-combat-breed": "fighting",
  "paldean-tauros-combat": "fighting",
  "combat-breed-paldean-tauros": "fighting",
  "combat-paldean-tauros": "fighting",
  "tauros-combat-breed": "fighting",
  "tauros-paldea-combat": "fighting",
  "tauros-paldea-blaze-breed": "fire",
  "paldean-tauros-blaze-breed": "fire",
  "paldean-tauros-blaze": "fire",
  "blaze-breed-paldean-tauros": "fire",
  "blaze-paldean-tauros": "fire",
  "tauros-blaze-breed": "fire",
  "tauros-paldea-blaze": "fire",
  "tauros-paldea-aqua-breed": "water",
  "paldean-tauros-aqua-breed": "water",
  "paldean-tauros-aqua": "water",
  "aqua-breed-paldean-tauros": "water",
  "aqua-paldean-tauros": "water",
  "tauros-aqua-breed": "water",
  "tauros-paldea-aqua": "water",
};

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
    item: "Safety Goggles",
    moves: ["Fake Out", "Flare Blitz", "Parting Shot", "Knock Off"],
  },
  {
    pokemon: "Amoonguss",
    ability: "Regenerator",
    item: "Sitrus Berry",
    moves: ["Spore", "Rage Powder", "Pollen Puff", "Clear Smog"],
  },
  {
    pokemon: "Flutter Mane",
    ability: "Protosynthesis",
    item: "Booster Energy",
    moves: ["Moonblast", "Shadow Ball", "Icy Wind", "Protect"],
  },
  {
    pokemon: "Urshifu Rapid Strike",
    ability: "Unseen Fist",
    item: "Mystic Water",
    moves: ["Surging Strikes", "Close Combat", "Aqua Jet", "Protect"],
  },
  {
    pokemon: "Rillaboom",
    ability: "Grassy Surge",
    item: "Assault Vest",
    moves: ["Fake Out", "Wood Hammer", "Grassy Glide", "U-turn"],
  },
  {
    pokemon: "Kingambit",
    ability: "Defiant",
    item: "Black Glasses",
    moves: ["Kowtow Cleave", "Iron Head", "Sucker Punch", "Protect"],
  },
];

const POKE_API = "https://pokeapi.co/api/v2";
const team = Array.from({ length: 6 }, () => ({ pokemon: "", ability: "", item: "", moves: ["", "", "", ""] }));
const pokemonCache = new Map();
const moveCache = new Map();
let pendingSave = null;
let lines = [];
let selectedLineId = null;
let lineDraftSlots = [];
let savedTeams = [];

const elements = {
  teamGrid: document.querySelector("#teamGrid"),
  teamStatus: document.querySelector("#teamStatus"),
  threatList: document.querySelector("#threatList"),
  mostCoverageList: document.querySelector("#mostCoverageList"),
  leastCoverageList: document.querySelector("#leastCoverageList"),
  priorityInsight: document.querySelector("#priorityInsight"),
  speedControlInsight: document.querySelector("#speedControlInsight"),
  defenseMatrix: document.querySelector("#defenseMatrix"),
  suggestions: document.querySelector("#suggestions"),
  template: document.querySelector("#pokemonCardTemplate"),
  teamPaste: document.querySelector("#teamPaste"),
  importButton: document.querySelector("#importButton"),
  exportButton: document.querySelector("#exportButton"),
  loadSampleButton: document.querySelector("#loadSampleButton"),
  clearButton: document.querySelector("#clearButton"),
  saveTeamButton: document.querySelector("#saveTeamButton"),
  teamNameInput: document.querySelector("#teamNameInput"),
  savedTeams: document.querySelector("#savedTeams"),
  lineNameInput: document.querySelector("#lineNameInput"),
  lineSlotPicker: document.querySelector("#lineSlotPicker"),
  addLineButton: document.querySelector("#addLineButton"),
  savedLines: document.querySelector("#savedLines"),
  lineThreatList: document.querySelector("#lineThreatList"),
  lineCoverageList: document.querySelector("#lineCoverageList"),
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

function priorityBadge(priority) {
  const span = document.createElement("span");
  span.className = "priority-badge";
  span.title = `Priority +${priority}`;
  span.textContent = `+${priority}`;
  return span;
}

function ragingBullType(slot) {
  const pokemonTypes = slot.meta?.types || [];
  if (pokemonTypes.includes("water")) return "water";
  if (pokemonTypes.includes("fire")) return "fire";
  if (pokemonTypes.includes("fighting")) return "fighting";

  const metaName = normalizeName(slot.meta?.name || "");
  const rawName = normalizeName(slot.pokemon || "");
  return RAGING_BULL_TYPES[metaName] || RAGING_BULL_TYPES[rawName] || null;
}

function getEffectiveMove(slot, move) {
  if (!move) return null;
  const moveName = normalizeName(move.name);
  let effectiveType = move.type;

  if (moveName === "raging-bull") {
    effectiveType = ragingBullType(slot) || effectiveType;
  }

  if (normalizeName(slot.ability) === "liquid-voice" && SOUND_MOVES.has(moveName)) {
    effectiveType = "water";
  }

  return { ...move, effectiveType };
}

function getSpeedControlKind(move) {
  const moveName = normalizeName(move.name);
  if (moveName === "tailwind" || moveName === "trick-room" || moveName === "quash" || moveName === "after-you") return "setup";
  if (moveName === "icy-wind" || moveName === "electroweb" || moveName === "bulldoze" || moveName === "rock-tomb" || moveName === "mud-shot") return "drop";
  if (moveName === "glare" || moveName === "thunder-wave" || moveName === "nuzzle" || moveName === "stun-spore" || moveName === "thunder" || moveName === "zap-cannon" || moveName === "body-slam") return "paralysis";
  if (move.meta?.ailment?.name === "paralysis" && (move.meta?.ailment_chance || 0) > 0) return "paralysis";
  if (move.statChanges?.some((entry) => entry.stat?.name === "speed" && entry.change < 0)) return "drop";
  return null;
}

function renderStatStrip(container, stats) {
  if (!stats) {
    container.className = "stat-strip empty-state";
    container.textContent = "";
    return;
  }

  container.className = "stat-strip";
  container.replaceChildren(
    ...Object.entries(STAT_LABELS).map(([key, label]) => {
      const item = document.createElement("span");
      item.className = "stat-chip";
      const statLabel = document.createElement("strong");
      statLabel.textContent = label;
      const value = document.createElement("span");
      value.textContent = stats[key];
      item.append(statLabel, value);
      return item;
    }),
  );
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
    "paldean-tauros-combat-breed": "tauros-paldea-combat-breed",
    "paldean-tauros-combat": "tauros-paldea-combat-breed",
    "combat-breed-paldean-tauros": "tauros-paldea-combat-breed",
    "combat-paldean-tauros": "tauros-paldea-combat-breed",
    "tauros-combat-breed": "tauros-paldea-combat-breed",
    "tauros-paldea-combat": "tauros-paldea-combat-breed",
    "paldean-tauros-blaze-breed": "tauros-paldea-blaze-breed",
    "paldean-tauros-blaze": "tauros-paldea-blaze-breed",
    "blaze-breed-paldean-tauros": "tauros-paldea-blaze-breed",
    "blaze-paldean-tauros": "tauros-paldea-blaze-breed",
    "tauros-blaze-breed": "tauros-paldea-blaze-breed",
    "tauros-paldea-blaze": "tauros-paldea-blaze-breed",
    "paldean-tauros-aqua-breed": "tauros-paldea-aqua-breed",
    "paldean-tauros-aqua": "tauros-paldea-aqua-breed",
    "aqua-breed-paldean-tauros": "tauros-paldea-aqua-breed",
    "aqua-paldean-tauros": "tauros-paldea-aqua-breed",
    "tauros-aqua-breed": "tauros-paldea-aqua-breed",
    "tauros-paldea-aqua": "tauros-paldea-aqua-breed",
  };
  if (aliases[normalized]) {
    return aliases[normalized];
  }
  const regionalMatch = normalized.match(/^(alolan|galarian|hisuian|paldean)-(.+)$/);
  if (regionalMatch) {
    return `${regionalMatch[2]}-${regionalPrefixes[regionalMatch[1]]}`;
  }
  return normalized;
}

async function getPokemon(name) {
  const apiName = pokemonApiName(name);
  if (!apiName) return null;
  if (pokemonCache.has(apiName)) return pokemonCache.get(apiName);

  const promise = fetchJson(`${POKE_API}/pokemon/${apiName}`).then((data) => ({
    name: titleCase(data.name),
    types: data.types.map((entry) => entry.type.name),
    stats: Object.fromEntries(data.stats.map((entry) => [entry.stat.name, entry.base_stat])),
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
    priority: data.priority,
    meta: data.meta,
    statChanges: data.stat_changes,
  }));

  moveCache.set(apiName, promise);
  return promise;
}

function saveTeam() {
  window.clearTimeout(pendingSave);
  pendingSave = window.setTimeout(() => {
    localStorage.setItem("vgc-team-tool", JSON.stringify({ team, lines, selectedLineId, savedTeams }));
  }, 100);
}

function loadStoredTeam() {
  try {
    const stored = JSON.parse(localStorage.getItem("vgc-team-tool") || "null");
    const storedTeam = Array.isArray(stored) ? stored : stored?.team;
    if (!Array.isArray(storedTeam)) return;
    storedTeam.slice(0, 6).forEach((slot, index) => {
      team[index] = {
        pokemon: slot.pokemon || "",
        ability: slot.ability || "",
        item: slot.item || "",
        moves: Array.from({ length: 4 }, (_, moveIndex) => slot.moves?.[moveIndex] || ""),
      };
    });
    lines = Array.isArray(stored?.lines) ? stored.lines : [];
    selectedLineId = typeof stored?.selectedLineId === "string" ? stored.selectedLineId : lines[0]?.id || null;
    lineDraftSlots = lines.find((line) => line.id === selectedLineId)?.slots ? [...lines.find((line) => line.id === selectedLineId).slots] : [];
    savedTeams = Array.isArray(stored?.savedTeams) ? stored.savedTeams : [];
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

    const lineDraftCheckbox = card.querySelector(".line-draft-checkbox");
    lineDraftCheckbox.checked = lineDraftSlots.includes(index);
    lineDraftCheckbox.addEventListener("change", () => {
      if (lineDraftCheckbox.checked) {
        if (lineDraftSlots.length >= 4) {
          lineDraftCheckbox.checked = false;
          return;
        }
        lineDraftSlots = [...lineDraftSlots, index];
      } else {
        lineDraftSlots = lineDraftSlots.filter((slotIndex) => slotIndex !== index);
      }
      syncLineDraftCheckboxes();
      analyzeTeam();
    });

    const abilityInput = card.querySelector(".ability-input");
    abilityInput.value = slot.ability;
    abilityInput.addEventListener("input", () => {
      team[index].ability = abilityInput.value;
      saveTeam();
      hydrateSlotMoves(index).then(analyzeTeam);
    });

    const itemInput = card.querySelector(".item-input");
    itemInput.value = slot.item;
    itemInput.addEventListener("input", () => {
      team[index].item = itemInput.value;
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
  const statStrip = card.querySelector(".stat-strip");

  typeRow.innerHTML = "";
  message.textContent = "";
  sprite.removeAttribute("src");
  renderStatStrip(statStrip, null);

  if (slot.pokemon.trim()) {
    message.textContent = "Loading Pokemon...";
    try {
      const pokemon = await getPokemon(slot.pokemon);
      slot.meta = pokemon;
      typeRow.replaceChildren(...pokemon.types.map(typeBadge));
      renderStatStrip(statStrip, pokemon.stats);
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
    const effectiveMove = getEffectiveMove(slot, move);
    slot.moveMeta = slot.moveMeta || [];
    slot.moveMeta[moveIndex] = move;
    typeContainer.classList.toggle("status-move", move.damageClass === "status");
    const badges = [moveTypeBadge(effectiveMove.effectiveType)];
    if (move.priority > 0) badges.push(priorityBadge(move.priority));
    typeContainer.replaceChildren(...badges);
  } catch {
    slot.moveMeta = slot.moveMeta || [];
    slot.moveMeta[moveIndex] = null;
    const span = document.createElement("span");
    span.className = "empty-state";
    span.textContent = "?";
    typeContainer.append(span);
  }
}

function hydrateSlotMoves(index) {
  return Promise.all(team[index].moves.map((move, moveIndex) => hydrateMove(index, moveIndex)));
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


function getLineSlots(line) {
  return (line?.slots || []).map((index) => team[index]).filter((slot) => slot?.meta?.types?.length);
}

function renderLineBuilder() {
  const buttons = team.map((slot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `line-slot-button ${lineDraftSlots.includes(index) ? "active" : "secondary"}`;
    const pokemonName = slot.meta?.name || slot.pokemon || `Slot ${index + 1}`;
    button.textContent = `${index + 1}. ${pokemonName}`;
    button.title = `Toggle slot ${index + 1} in current line draft`;
    button.addEventListener("click", () => {
      if (lineDraftSlots.includes(index)) {
        lineDraftSlots = lineDraftSlots.filter((entry) => entry !== index);
      } else if (lineDraftSlots.length < 4) {
        lineDraftSlots = [...lineDraftSlots, index];
      }
      syncLineDraftCheckboxes();
      analyzeTeam();
    });
    return button;
  });
  elements.lineSlotPicker.replaceChildren(...buttons);
}

function renderLinesAnalysis() {
  renderLineBuilder();
  elements.addLineButton.textContent = `Save 4-Pokemon Line (${lineDraftSlots.length}/4)`;
  if (!lines.length) {
    elements.savedLines.className = "saved-lines empty-state";
    elements.savedLines.textContent = "No lines saved yet.";
    elements.lineThreatList.className = "type-list empty-state";
    elements.lineThreatList.textContent = "Save and select a line to view weaknesses.";
    elements.lineCoverageList.className = "type-list empty-state";
    elements.lineCoverageList.textContent = "Save and select a line to view offensive coverage.";
    return;
  }
  elements.savedLines.className = "saved-lines";
  elements.savedLines.replaceChildren(...lines.map((line) => {
    const row = document.createElement("div");
    row.className = `saved-line ${line.id === selectedLineId ? "active" : ""}`;
    const select = document.createElement("button");
    select.type = "button";
    select.className = "secondary";
    select.textContent = line.name;
    select.addEventListener("click", () => { selectedLineId = line.id; lineDraftSlots = [...line.slots]; syncLineDraftCheckboxes(); saveTeam(); analyzeTeam(); });
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => { lines = lines.filter((entry) => entry.id !== line.id); if (selectedLineId===line.id) selectedLineId=lines[0]?.id||null; saveTeam(); analyzeTeam(); });
    row.append(select, del);
    return row;
  }));
}

function syncLineDraftCheckboxes() {
  team.forEach((slot, index) => {
    const card = getCard(index);
    const checkbox = card?.querySelector(".line-draft-checkbox");
    if (checkbox) checkbox.checked = lineDraftSlots.includes(index);
  });
}

function renderSavedTeams() {
  if (!savedTeams.length) {
    elements.savedTeams.className = "saved-lines empty-state";
    elements.savedTeams.textContent = "No saved teams yet.";
    return;
  }
  elements.savedTeams.className = "saved-lines";
  elements.savedTeams.replaceChildren(...savedTeams.map((entry) => {
    const row = document.createElement("div");
    row.className = "saved-line";
    const load = document.createElement("button");
    load.type = "button";
    load.className = "secondary";
    load.textContent = entry.name;
    load.addEventListener("click", () => {
      entry.team.forEach((slot, index) => {
        team[index] = { pokemon: slot.pokemon || "", ability: slot.ability || "", item: slot.item || "", moves: Array.from({ length: 4 }, (_, moveIndex) => slot.moves?.[moveIndex] || "") };
      });
      lines = Array.isArray(entry.lines) ? entry.lines : [];
      selectedLineId = lines[0]?.id || null;
      lineDraftSlots = lines[0]?.slots ? [...lines[0].slots] : [];
      saveTeam();
      renderTeam();
    });
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => { savedTeams = savedTeams.filter((teamEntry) => teamEntry.id !== entry.id); saveTeam(); analyzeTeam(); });
    row.append(load, del);
    return row;
  }));
}

function saveCurrentTeamPreset() {
  const name = elements.teamNameInput.value.trim() || `Team ${savedTeams.length + 1}`;
  const snapshot = team.map((slot) => ({ pokemon: slot.pokemon, ability: slot.ability, item: slot.item, moves: [...slot.moves] }));
  const snapshotLines = lines.map((line) => ({ ...line, slots: [...line.slots] }));
  savedTeams.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, name, team: snapshot, lines: snapshotLines });
  elements.teamNameInput.value = "";
  saveTeam();
  analyzeTeam();
}

function analyzeTeam() {
  const loadedPokemon = team.filter((slot) => slot.meta?.types?.length);
  const loadedMoves = team
    .flatMap((slot) => (slot.moveMeta || []).map((move) => getEffectiveMove(slot, move)))
    .filter((move) => move?.effectiveType);
  const attackingMoves = loadedMoves.filter((move) => move.damageClass !== "status");

  elements.teamStatus.textContent = `${loadedPokemon.length} / 6 loaded`;
  renderSavedTeams();

  const defensiveRows = TYPES.map((attackType) => {
    const multipliers = loadedPokemon.map((slot) => getTypeMultiplier(attackType, slot.meta.types));
    const weak = multipliers.filter((value) => value > 1).length;
    const resist = multipliers.filter((value) => value < 1).length;
    const immune = multipliers.filter((value) => value === 0).length;
    const total = multipliers.reduce((sum, value) => sum + value, 0);
    return { type: attackType, weak, resist, immune, total };
  });

  const offensiveRows = TYPES.map((defenderType) => {
    const superEffectiveMoves = attackingMoves.filter((move) => getTypeMultiplier(move.effectiveType, [defenderType]) > 1);
    return {
      type: defenderType,
      count: superEffectiveMoves.length,
      sources: [...new Set(superEffectiveMoves.map((move) => move.effectiveType))],
    };
  });

  renderThreats(defensiveRows, loadedPokemon.length);
  renderCoverage(offensiveRows, attackingMoves.length);
  renderPriority(getPriorityRows(team), loadedPokemon.length);
  renderSpeedControl(getSpeedControlRows(team), loadedPokemon.length);
  renderMatrix(defensiveRows, loadedPokemon.length);
  renderSuggestions(defensiveRows, offensiveRows, loadedPokemon.length, loadedMoves.length - attackingMoves.length);
  renderLinesAnalysis();

  const selectedLine = lines.find((line) => line.id === selectedLineId);
  const lineSlots = getLineSlots(selectedLine);
  const lineMoves = lineSlots.flatMap((slot) => (slot.moveMeta || []).map((move) => getEffectiveMove(slot, move))).filter((move) => move?.effectiveType && move.damageClass !== "status");
  if (!selectedLine || lineSlots.length !== 4) {
    elements.lineThreatList.className = "type-list empty-state";
    elements.lineThreatList.textContent = selectedLine ? "Line needs 4 loaded Pokemon to evaluate." : "Save and select a line to view weaknesses.";
    elements.lineCoverageList.className = "type-list empty-state";
    elements.lineCoverageList.textContent = "Save and select a line to view offensive coverage.";
    return;
  }
  const lineDef = TYPES.map((attackType) => ({ type: attackType, weak: lineSlots.filter((slot) => getTypeMultiplier(attackType, slot.meta.types) > 1).length }))
    .filter((row) => row.weak >= 2).sort((a,b)=>b.weak-a.weak).slice(0,6);
  elements.lineThreatList.className = lineDef.length ? "type-list" : "type-list empty-state";
  elements.lineThreatList.textContent = "";
  if (lineDef.length) elements.lineThreatList.replaceChildren(...lineDef.map((row)=>scoreChip(row.type, `${row.weak} weak`)));
  else elements.lineThreatList.textContent = "No major shared weakness for this line.";

  const lineOff = TYPES.map((defType)=>({type:defType,count:lineMoves.filter((move)=>getTypeMultiplier(move.effectiveType,[defType])>1).length}))
    .sort((a,b)=>a.count-b.count||a.type.localeCompare(b.type)).slice(0,6);
  elements.lineCoverageList.className = "type-list";
  elements.lineCoverageList.replaceChildren(...lineOff.map((row)=>scoreChip(row.type, `${row.count} hits`)));
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

function getPriorityRows(slots) {
  const groups = {
    damage: [],
    disruption: [],
  };
  const blockers = [];
  const hasGrassySurge = slots.some((slot) => normalizeName(slot.ability) === "grassy-surge");

  const addPriorityNote = (group, title, body) => {
    groups[group].push({ title, body });
  };

  const formatMoves = (moves) => moves.map((move) => `${move.name} +${move.priority}`).join(", ");

  slots.forEach((slot) => {
    if (!slot.pokemon && !slot.meta) return;

    const pokemonName = slot.meta?.name || slot.pokemon;
    const ability = normalizeName(slot.ability);
    const moves = (slot.moveMeta || []).filter(Boolean);
    const directPriority = moves.filter((move) => move.priority > 0 && !PRIORITY_ANALYSIS_IGNORES.has(normalizeName(move.name)));
    const directDamage = directPriority.filter((move) => move.damageClass !== "status");
    const directDisruption = directPriority.filter((move) => move.damageClass === "status");

    if (directDamage.length) {
      addPriorityNote("damage", pokemonName, formatMoves(directDamage));
    }

    if (directDisruption.length) {
      addPriorityNote("disruption", pokemonName, formatMoves(directDisruption));
    }

    if (ability === "prankster") {
      const statusMoves = moves.filter(
        (move) => move.damageClass === "status" && !PRIORITY_ANALYSIS_IGNORES.has(normalizeName(move.name)),
      );
      addPriorityNote(
        "disruption",
        pokemonName,
        statusMoves.length
          ? `Prankster can raise status moves like ${statusMoves.map((move) => move.name).join(", ")}.`
          : "Prankster can give status moves increased priority.",
      );
    }

    if (ability === "gale-wings") {
      const flyingMoves = moves.map((move) => getEffectiveMove(slot, move)).filter((move) => move.effectiveType === "flying");
      const flyingDamage = flyingMoves.filter((move) => move.damageClass !== "status");
      const flyingDisruption = flyingMoves.filter((move) => move.damageClass === "status");
      if (flyingDamage.length) {
        addPriorityNote(
          "damage",
          pokemonName,
          `Gale Wings can raise Flying attacks like ${flyingDamage.map((move) => move.name).join(", ")} while at full HP.`,
        );
      }
      if (flyingDisruption.length) {
        addPriorityNote(
          "disruption",
          pokemonName,
          `Gale Wings can raise Flying status moves like ${flyingDisruption.map((move) => move.name).join(", ")} while at full HP.`,
        );
      }
      if (!flyingMoves.length) {
        addPriorityNote("disruption", pokemonName, "Gale Wings can give Flying moves increased priority while at full HP.");
      }
    }

    if (ability === "triage") {
      const healingMoves = moves.filter((move) => HEALING_MOVES.has(normalizeName(move.name)));
      const healingDamage = healingMoves.filter((move) => move.damageClass !== "status");
      const healingDisruption = healingMoves.filter((move) => move.damageClass === "status");
      if (healingDamage.length) {
        addPriorityNote("damage", pokemonName, `Triage can raise draining attacks like ${healingDamage.map((move) => move.name).join(", ")}.`);
      }
      if (healingDisruption.length) {
        addPriorityNote("disruption", pokemonName, `Triage can raise healing status moves like ${healingDisruption.map((move) => move.name).join(", ")}.`);
      }
      if (!healingMoves.length) {
        addPriorityNote("disruption", pokemonName, "Triage can give healing moves increased priority.");
      }
    }

    if (hasGrassySurge && moves.some((move) => normalizeName(move.name) === "grassy-glide")) {
      addPriorityNote("damage", pokemonName, "Grassy Glide can become priority while Grassy Terrain is active.");
    }

    if (["armor-tail", "queenly-majesty", "dazzling"].includes(ability)) {
      blockers.push(`${pokemonName} blocks opposing priority moves with ${slot.ability}.`);
    }

    if (ability === "psychic-surge") {
      blockers.push(`${pokemonName} can set Psychic Terrain, which blocks many priority moves against grounded Pokemon.`);
    }
  });

  if (blockers.length) {
    addPriorityNote("disruption", "Priority protection", blockers.join(" "));
  }

  return groups;
}

function getSpeedControlRows(slots) {
  const groups = {
    drop: [],
    setup: [],
    paralysis: [],
  };

  const addSpeedNote = (group, title, body) => {
    groups[group].push({ title, body });
  };

  slots.forEach((slot) => {
    if (!slot.pokemon && !slot.meta) return;

    const pokemonName = slot.meta?.name || slot.pokemon;
    const moves = (slot.moveMeta || []).filter(Boolean).map((move) => getEffectiveMove(slot, move));
    const speedDroppers = moves.filter((move) => getSpeedControlKind(move) === "drop");
    const turnOrderMoves = moves.filter((move) => getSpeedControlKind(move) === "setup");
    const paralysisMoves = moves.filter((move) => getSpeedControlKind(move) === "paralysis");

    if (speedDroppers.length) {
      addSpeedNote(
        "drop",
        pokemonName,
        speedDroppers
          .map((move) => {
            const speedChange = move.statChanges.find((entry) => entry.stat?.name === "speed")?.change ?? 0;
            return `${move.name} ${speedChange < 0 ? `(${speedChange} Speed)` : ""}`.trim();
          })
          .join(", "),
      );
    }

    if (turnOrderMoves.length) {
      addSpeedNote("setup", pokemonName, `sets ${turnOrderMoves.map((move) => move.name).join(", ")}`);
    }

    if (paralysisMoves.length) {
      addSpeedNote("paralysis", pokemonName, `can paralyze with ${paralysisMoves.map((move) => move.name).join(", ")}`);
    }
  });

  return groups;
}

function renderPriority(groups, teamSize) {
  if (!teamSize) {
    elements.priorityInsight.className = "priority-columns empty-state";
    elements.priorityInsight.textContent = "Add moves and abilities to see priority options.";
    return;
  }

  if (!groups.damage.length && !groups.disruption.length) {
    elements.priorityInsight.className = "priority-columns empty-state";
    elements.priorityInsight.textContent = "No clear priority tools detected yet.";
    return;
  }

  elements.priorityInsight.className = "priority-columns";
  const renderGroup = (label, rows, groupClass) => {
    const section = document.createElement("div");
    section.className = `priority-column ${groupClass}`;

    const heading = document.createElement("h4");
    heading.textContent = label;
    section.append(heading);

    rows.forEach((row) => {
      const item = document.createElement("div");
      item.className = "priority-note";

      const title = document.createElement("strong");
      title.textContent = row.title;

      const body = document.createElement("span");
      body.textContent = row.body;

      item.append(title, body);
      section.append(item);
    });

    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "priority-note empty-state";
      empty.textContent = "None detected.";
      section.append(empty);
    }

    return section;
  };

  const sections = [
    renderGroup("Damage", groups.damage, "damage"),
    renderGroup("Disruption", groups.disruption, "disruption"),
  ];

  elements.priorityInsight.replaceChildren(...sections);
}

function renderSpeedControl(groups, teamSize) {
  if (!teamSize) {
    elements.speedControlInsight.className = "speed-control-list empty-state";
    elements.speedControlInsight.textContent = "Add speed control moves to see turn-order effects.";
    return;
  }

  if (!groups.drop.length && !groups.setup.length && !groups.paralysis.length) {
    elements.speedControlInsight.className = "speed-control-list empty-state";
    elements.speedControlInsight.textContent = "No clear speed control tools detected yet.";
    return;
  }

  elements.speedControlInsight.className = "speed-control-list";
  const renderGroup = (label, rows) => {
    const section = document.createElement("div");
    section.className = "speed-control-group";

    const heading = document.createElement("h4");
    heading.textContent = label;
    section.append(heading);

    rows.forEach((row) => {
      const item = document.createElement("div");
      item.className = "speed-control-note";

      const title = document.createElement("strong");
      title.textContent = row.title;

      const body = document.createElement("span");
      body.textContent = row.body;

      item.append(title, body);
      section.append(item);
    });

    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "speed-control-note empty-state";
      empty.textContent = "None detected.";
      section.append(empty);
    }

    return section;
  };

  const sections = [
    renderGroup("Speed Drops", groups.drop),
    renderGroup("Turn Order", groups.setup),
    renderGroup("Paralysis", groups.paralysis),
  ];

  elements.speedControlInsight.replaceChildren(...sections);
}

function renderMatrix(rows, teamSize) {
  if (!teamSize) {
    elements.defenseMatrix.className = "matrix empty-state";
    elements.defenseMatrix.textContent = "Add Pokemon to see incoming type pressure.";
    return;
  }

  elements.defenseMatrix.className = "matrix";
  const grouped = rows
    .slice()
    .sort((a, b) => b.weak - a.weak || b.total - a.total)
    .reduce((acc, row) => {
      const key = row.weak;
      if (!acc.has(key)) acc.set(key, []);
      acc.get(key).push(row);
      return acc;
    }, new Map());

  elements.defenseMatrix.replaceChildren(
    ...[...grouped.entries()].map(([weakCount, groupRows]) => {
      const group = document.createElement("div");
      group.className = "matrix-group";

      const heading = document.createElement("h4");
      heading.textContent = `${weakCount} weakness${weakCount === 1 ? "" : "es"}`;
      group.append(heading);

      const item = document.createElement("div");
      item.className = "matrix-row";

      const types = document.createElement("div");
      types.className = "matrix-types";
      types.append(...groupRows.map((row) => typeBadge(row.type)));

      const value = document.createElement("span");
      value.className = "matrix-value";
      value.textContent = `${weakCount}/${teamSize}`;

      item.append(types, value);
      group.append(item);

      return group;
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
      item: slot.item,
      moves: [...slot.moves],
    };
  });
  saveTeam();
  renderTeam();
}

function clearTeam() {
  team.forEach((slot, index) => {
    team[index] = { pokemon: "", ability: "", item: "", moves: ["", "", "", ""] };
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
      const itemMatch = header.match(/\s@\s(.+)$/);
      const item = itemMatch ? itemMatch[1].trim() : "";
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
        item,
        moves: Array.from({ length: 4 }, (_, index) => moves[index] || ""),
      };
    });
}

function importPaste() {
  const parsed = parseTeamPaste(elements.teamPaste.value);
  if (!parsed.length) return;

  team.forEach((slot, index) => {
    team[index] = parsed[index] || { pokemon: "", ability: "", item: "", moves: ["", "", "", ""] };
  });
  saveTeam();
  renderTeam();
}

function exportTeam() {
  const text = team
    .filter((slot) => slot.pokemon || slot.ability || slot.item || slot.moves.some(Boolean))
    .map((slot) => {
      const lines = [`${slot.pokemon || "Unknown"}${slot.item ? ` @ ${slot.item}` : ""}`];
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
elements.saveTeamButton.addEventListener("click", saveCurrentTeamPreset);
elements.addLineButton.addEventListener("click", () => {
  const defaultSlots = [0, 1, 2, 3];
  const slots = lineDraftSlots.length === 4 ? [...lineDraftSlots] : defaultSlots;
  const name = elements.lineNameInput.value.trim() || `Line ${lines.length + 1}`;
  const line = { id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, name, slots };
  lines.push(line);
  selectedLineId = line.id;
  lineDraftSlots = [...slots];
  elements.lineNameInput.value = "";
  syncLineDraftCheckboxes();
  saveTeam();
  analyzeTeam();
});

loadStoredTeam();
renderTeam();
analyzeTeam();
