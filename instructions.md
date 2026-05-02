# Pokemon VGC Tool

## Things to know
- VGC always follows a specific format. The list of available Pokemon varies greatly by format. Because of this, it's probably best to get data on ALL Pokemon, and just include specific Pokemon depending on what's allowed in the format.

- We will need to import or reconstruct an accurate list of type matchups and affinities for the tool, so it can determine multipliers and weaknesses/synergies.

- I will provide my Pokemon with lists of their names, moves and abilities. The tool should be able to automatically assign the appropriate types to the Pokemon and each selected move. As an example, the tool should know that Blastoise is a Water type Pokemon. It should understand that Water Spout is a Water type move, Aura Sphere is a Fighting type move, etc. It should understand that Kingambit, a Steel and Dark dual-type, takes 4x damage from a Fighting type attack as both of its types are weak to Fighting.

- The tool should look at the team the user has built and display objective values based on the team's calculated synergies and weaknesses. It should offer helpful, but not prescriptive suggestions. For instance, if 4/6 of a team's Pokemon have a weakness to Fairy type attacks, the tool should say something like "Your team could struggle against" followed by all the types determined to be of a significant threat. Additionally, it should do the same thing for types the team might excel against.