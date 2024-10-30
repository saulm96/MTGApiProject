const types =[
      "Artifact",
      "Battle",
      "Conspiracy",
      "Creature",
      "Dragon",
      "Elemental",
      "Enchantment",
      "Goblin",
      "Hero",
      "instant",
      "Instant",
      "Jaguar",
      "Kindred",
      "Knights",
      "Land",
      "Legend",
      "Phenomenon",
      "Plane",
      "Planeswalker",
      "Scheme",
      "Sorcery",
      "Stickers",
      "Summon",
      "Tribal",
      "Universewalker",
      "Vanguard",
      "Wolf"
    ]
  
function renderTypes(types){
    const selector = document.getElementById('type-selector');
    const emptyResponse = document.createElement('option');
    emptyResponse.value = ' ';
    emptyResponse.text = 'No type'
    selector.appendChild(emptyResponse);

    for(const type of types){
        const option = document.createElement('option')
        option.value = type;
        option.text = type;
        selector.add(option);;
    }
}
renderTypes(types);