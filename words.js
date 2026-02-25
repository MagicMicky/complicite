const WORDS = [
  // === FACILE (~30%) — concrets, un mot, tout le monde trouve vite ===

  // Animaux courants
  "chat", "chien", "loup", "ours", "singe", "requin", "aigle", "tortue",
  "grenouille", "papillon", "dauphin", "perroquet", "pingouin", "hibou",

  // Nourriture simple
  "pizza", "chocolat", "crêpe", "croissant", "fromage", "gâteau",
  "glace", "bonbon", "hamburger", "spaghetti",

  // Objets concrets
  "parapluie", "miroir", "bougie", "ballon", "guitare", "épée",
  "couronne", "jumelles", "drapeau", "échelle", "marteau", "loupe",

  // Lieux évidents
  "plage", "volcan", "château", "prison", "cirque", "phare",

  // Créatures connues
  "dinosaure", "fantôme", "dragon", "vampire", "pirate", "robot",

  // === MOYEN (~50%) — un ou deux mots, nécessite des indices créatifs ===

  // Animaux moins évidents
  "caméléon", "pieuvre", "hérisson", "flamant rose", "méduse",
  "hippopotame", "autruche", "piranha", "koala", "paon", "scorpion",

  // Nourriture évocatrice
  "fondue", "raclette", "ratatouille", "guimauve", "barbapapa",
  "gaufre", "bretzel", "macaron", "choucroute", "pot-au-feu",

  // Objets & trucs
  "épouvantail", "boomerang", "cerf-volant", "sablier", "catapulte",
  "toboggan", "trampoline", "tyrolienne", "kaléidoscope", "boussole",
  "nain de jardin", "cocotte-minute", "talkie-walkie", "piñata",
  "moulin à vent", "lampe à lave", "boule à neige", "confettis",
  "mégaphone", "chandelier",

  // Lieux & décors
  "fête foraine", "gratte-ciel", "labyrinthe", "igloo", "oasis",
  "plongeoir", "téléphérique", "grenier", "vestiaire",
  "cabane dans les arbres", "ring de boxe",

  // Métiers & rôles
  "cascadeur", "dompteur", "clown", "mime", "espion", "astronaute",
  "arbitre", "funambule", "ventriloque", "pickpocket", "fakir",

  // Nature & phénomènes
  "avalanche", "tornade", "arc-en-ciel", "éclipse", "geyser",
  "stalactite", "mirage", "sables mouvants", "aurore boréale",

  // Sport & jeux
  "plongeon", "salto", "penalty", "rodéo", "marathon", "luge",
  "tir à l'arc", "balle au prisonnier", "escape game",

  // Créatures & imaginaire
  "loup-garou", "yéti", "licorne", "sirène", "zombie", "momie",
  "cyclope", "centaure", "sorcière", "lutin", "extraterrestre",

  // Situations
  "embouteillage", "déménagement", "coup de soleil", "fou rire",
  "tour de magie", "cache-cache", "grasse matinée", "chasse au trésor",
  "bataille de polochons",

  // Sensations & corps
  "chatouille", "hoquet", "éternuement", "vertige", "chair de poule",
  "torticolis", "crampe", "ronflement",

  // === DIFFICILE (~20%) — expressions, concepts, force le détour ===

  // Situations complexes
  "gueule de bois", "coup de foudre", "mal de mer", "nuit blanche",
  "panne de réveil", "coupure de courant", "panne d'ascenseur",
  "heure de pointe", "contrôle d'identité",

  // Scènes de vie
  "feu d'artifice", "poisson d'avril", "photo de famille",
  "lancer de bouquet", "dîner aux chandelles", "réunion de famille",
  "rentrée des classes", "standing ovation", "alarme incendie",

  // Concepts visuels
  "tapis volant", "boule de cristal", "coffre au trésor",
  "potion magique", "passage secret", "château de sable",
  "toile d'araignée", "nid de guêpes",

  // Culture & activités
  "karaoké", "selfie", "brunch", "apéro", "camping sauvage",

  // Le truc improbable
  "somnambule", "papillon dans le ventre", "point de côté",
  "queue de poisson", "ola", "pierre-feuille-ciseaux",
  "patinage artistique", "saut à l'élastique",
  "chef d'orchestre", "commissaire-priseur",
];
