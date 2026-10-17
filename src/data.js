// Content mirrored from delvetolife.com/guides/dress-codes/ and /guides/colour/.
// Keep in sync when those guides change.
const G = 'https://delvetolife.com/guides/';

export const DRESS_CODES = [
  { id: 'casual', level: 1, name: 'Casual', aliases: ['casual attire', 'relaxed'],
    summary: 'Clean, comfortable everyday clothes, chosen with some care. "Casual" on an invitation still means clean, well-fitting and suited to the setting.',
    dress_route: 'A day dress or skirt with a simple top, trainers or flat sandals.',
    trouser_route: 'Jeans or chinos with a T-shirt, polo or casual shirt; clean trainers.',
    avoid: 'Gym clothes, worn-out pieces or slogans that might upset the host.',
    guide: G + 'dress-codes/' },
  { id: 'smart-casual', level: 2, name: 'Smart casual', aliases: ['smart casual attire', 'smart-casual'],
    summary: 'Everyday clothes with one polished element, such as a jacket, good knitwear or leather shoes. Debrett\'s calls it "often the hardest dress code to interpret"; printed invitations and city venues push it dressier.',
    dress_route: 'A midi dress or smart skirt and knit with a blazer or tailored coat; loafers, ankle boots or low heels.',
    trouser_route: 'Chinos or tailored trousers (dark jeans for a relaxed event) with a shirt or fine knit and an unstructured jacket; leather shoes or minimal trainers.',
    avoid: "Anything you'd only wear to the gym or the beach. If unsure, add the jacket.",
    guide: G + 'smart-casual-women/' },
  { id: 'business-casual', level: 3, name: 'Business casual', aliases: ['office casual', 'business-casual'],
    summary: 'Office clothes without the full formality of a suit and tie. Expectations vary between industries and workplaces, so look at what colleagues actually wear.',
    dress_route: 'A knee- or midi-length dress, or a skirt with a blouse or knit; a cardigan or blazer; closed shoes.',
    trouser_route: 'Tailored trousers or chinos with a collared shirt or fine knit; a blazer is optional and a tie usually unnecessary.',
    avoid: 'Ripped denim, very short hems and flip-flops, unless your workplace clearly accepts them.',
    guide: G + 'dress-codes/' },
  { id: 'dressy-casual', level: 4, name: 'Dressy casual', aliases: ['casual chic', 'elevated casual'],
    summary: "What you'd wear to a nice dinner: more polished than smart casual, less formal than cocktail.",
    dress_route: 'A dress in a richer fabric, or a smart skirt with a silky top; block heels or polished flats.',
    trouser_route: 'Tailored trousers with a crisp shirt or fine knit and a blazer; leather shoes.',
    avoid: 'Anything that looks like everyday office wear with nothing added.',
    guide: G + 'dress-codes/' },
  { id: 'cocktail', level: 5, name: 'Cocktail / semi-formal', aliases: ['cocktail attire', 'semi-formal', 'semi formal', 'semiformal', 'cocktail'],
    summary: 'Smart evening clothes, short of black tie. In the US "cocktail" and "semi-formal" are often used interchangeably for weddings and parties.',
    dress_route: 'A knee- to midi-length dress or a dressy jumpsuit, with heels or polished flats and one statement accessory.',
    trouser_route: 'A dark suit with a shirt; a tie is often expected in the evening. Dressy separates can also work.',
    avoid: 'A full-length ballgown (too formal) or daytime basics. Jeans are never cocktail attire.',
    guide: G + 'cocktail-attire/', also: [G + 'semi-formal-attire/'] },
  { id: 'lounge-suits', level: 6, name: 'Lounge suits (mainly UK)', aliases: ['lounge suit', 'lounge suits', 'business attire'],
    summary: 'Debrett\'s: "a suit worn with a shirt and tie in both the daytime and the evening." Mostly British invitation wording.',
    dress_route: 'A smart day dress, or a cocktail dress in the evening; a tailored jacket.',
    trouser_route: 'A business suit, shirt and tie.',
    avoid: 'Reading "lounge" as relaxed. It means a suit.',
    guide: G + 'dress-codes/' },
  { id: 'black-tie-optional', level: 7, name: 'Black tie optional', aliases: ['black tie invited', 'black-tie optional', 'formal'],
    summary: "The host will wear black tie and welcomes it, but doesn't require it.",
    dress_route: 'A long evening dress, an elegant cocktail dress or formal separates.',
    trouser_route: 'A tuxedo or dinner jacket, or a well-fitted dark suit with a tie.',
    avoid: 'Treating "optional" as "casual".',
    guide: G + 'black-tie-optional/' },
  { id: 'black-tie', level: 8, name: 'Black tie', aliases: ['black-tie', 'tuxedo', 'evening dress'],
    summary: 'Formal evening dress. Debrett\'s: "less formal than white tie and the most popular formal evening wear".',
    dress_route: 'An evening dress, usually long; evening skirts or trousers are also accepted.',
    trouser_route: 'A black or midnight dinner jacket (tuxedo) with matching trousers, white dress shirt and black bow tie.',
    avoid: "A business suit with a regular tie, unless the host has said that's fine.",
    guide: G + 'dress-codes/' },
  { id: 'white-tie', level: 9, name: 'White tie', aliases: ['white-tie', 'full evening dress', 'tails'],
    summary: 'The most formal evening code; rare, mostly state, ceremonial and traditional society events.',
    dress_route: 'A full-length evening gown; long gloves are traditional at some events.',
    trouser_route: 'A black tailcoat with matching trousers, a white waistcoat, a wing-collar shirt and a white bow tie.',
    avoid: 'Substituting black tie. If a ball says white tie, it means it. Hire if you need to.',
    guide: G + 'dress-codes/' },
];

export const DRESS_CODE_TIPS = [
  'Not sure? Dress one step above where you think the event sits.',
  'Evening, a city venue and a printed invitation push formality up; daytime, the countryside and a message invitation bring it down.',
  'Religious services, funerals and some cultural ceremonies have their own expectations about coverage and colour.',
  "The host's wishes always come first. A short message to ask is better than a guess.",
];

export const COLOUR_COMBINATIONS = [
  { colours: ['navy', 'cream', 'camel'], relationship: 'Neutral base', try_it: 'Navy trousers, a cream knit, a camel coat or bag' },
  { colours: ['black', 'white', 'red'], relationship: 'High contrast + accent', try_it: 'A white shirt, black trousers and a red lip, shoe or scarf' },
  { colours: ['olive', 'white', 'tan'], relationship: 'Earthy neutral', try_it: 'Olive chinos, a white tee and tan leather' },
  { colours: ['grey', 'burgundy'], relationship: 'Neutral + deep accent', try_it: 'A grey blazer over a burgundy knit' },
  { colours: ['camel', 'sky blue'], relationship: 'Warm + cool contrast', try_it: 'A light blue shirt under a camel jacket' },
  { colours: ['chocolate brown', 'pale pink'], relationship: 'Dark + soft contrast', try_it: 'Brown trousers with a pink top' },
  { colours: ['denim blue', 'rust'], relationship: 'Complementary', try_it: 'Jeans with a rust knit or scarf' },
  { colours: ['charcoal', 'mustard'], relationship: 'Neutral + bright accent', try_it: 'A charcoal coat with a mustard scarf' },
  { colours: ['navy', 'forest green'], relationship: 'Analogous', try_it: 'A green knit with navy trousers' },
  { colours: ['lavender', 'grey'], relationship: 'Soft cool', try_it: 'A lavender shirt with grey tailoring' },
  { colours: ['cream', 'oat', 'camel'], relationship: 'Tonal', try_it: 'Mix knit, cotton and leather textures' },
  { colours: ['cobalt', 'orange'], relationship: 'Complementary, bold', try_it: 'A cobalt dress or shirt with a small orange bag' },
];

export const COLOUR_SHORTCUTS = [
  'Neutral plus one accent: build the base from navy, grey, cream, camel, black or denim, then add one colour.',
  'Tonal: several shades of one colour (cream, oat, camel); vary the texture.',
  'Analogous: neighbours on the colour wheel, such as navy with forest green or rust with mustard.',
  'Complementary: opposites such as blue/orange, red/green, purple/yellow; give one most of the space and keep the other small.',
];

// Loose colour-name matching for the colour tool.
export const COLOUR_SYNONYMS = {
  blue: ['navy', 'sky blue', 'denim blue', 'cobalt'], brown: ['chocolate brown', 'camel', 'tan', 'rust'],
  green: ['olive', 'forest green'], beige: ['cream', 'oat', 'camel', 'tan'], khaki: ['olive', 'tan'],
  pink: ['pale pink'], purple: ['lavender'], yellow: ['mustard'], gray: ['grey', 'charcoal'],
  denim: ['denim blue'], jeans: ['denim blue'], red: ['red', 'burgundy', 'rust'], white: ['white', 'cream'],
};
