export const OCCASIONS = {everyday:'Everyday',work:'Work & meetings',dinner:'Dinner & occasions',travel:'Travel & walking'};
export const WEATHER = {mild:'Mild weather',warm:'Warm weather',cold:'Cold weather',wet:'Wet weather'};
export const MOODS = {tailored:'Relaxed tailoring',easy:'Easy & understated',soft:'Soft & expressive',covered:'More coverage'};
export const DEFAULT_STATE = {country:'WORLD',occasion:'everyday',weather:'mild',mood:'tailored',inspiration:''};
export function normalizeState(input, countries, inspirations) {
  return {country:countries.has(input?.country) ? input.country : 'WORLD',
    occasion:Object.hasOwn(OCCASIONS,input?.occasion) ? input.occasion : 'everyday',
    weather:Object.hasOwn(WEATHER,input?.weather) ? input.weather : 'mild',
    mood:Object.hasOwn(MOODS,input?.mood) ? input.mood : 'tailored',
    inspiration:inspirations.some(x=>x.id===input?.inspiration) ? input.inspiration : ''};
}
export function buildLook(state) {
  const {mood,weather,occasion} = state;
  const soft=mood==='soft', covered=mood==='covered', easy=mood==='easy';
  const palette=soft ? ['#f4ede1','#ad6654','#5d5747'] : easy ? ['#7c8666','#37516b','#aa7955'] : covered ? ['#d5c6ac','#5b6650','#54473d'] : ['#d5c6ac','#515654','#7d3f43'];
  let upper=easy?'A light cardigan over a simple top':soft?'A soft blouse or fine knit':covered?'An opaque, long-sleeved shirt':'A relaxed blazer over a simple top';
  let upperNote=covered?'Choose a neckline and hem length you feel comfortable in.':'Leave enough room to lift your arms and sit comfortably.';
  let bottom=soft?'A flowing midi skirt':easy?'Straight-leg jeans':'Relaxed straight or wide-leg trousers';
  let bottomNote=soft?'Try a small front tuck or a shorter top to show where the skirt begins.':'Let the hem clear the ground in the shoes you will actually wear.';
  let shoes=soft?'Ballet flats or flat sandals':'Comfortable loafers or clean trainers';
  let shoeNote='Choose a pair you have already walked in comfortably.';
  let bag=occasion==='work'?'A secure work tote':occasion==='travel'?'A zipped crossbody bag':'A compact shoulder bag';
  let bagNote=occasion==='work'?'Check the real laptop measurements, closure and loaded weight.':occasion==='travel'?'Keep the strap comfortable and your hands free.':'Carry what you need; a familiar bag is a good place to start.';
  let finish='One small focal point';
  let finishNote=soft?'Try a favourite earring, scarf or texture. Keep the rest quiet.':'A burgundy bag, a watch or a belt can be enough. Pick one.';
  if(weather==='warm') {
    upper=soft?'An airy blouse':covered?'An opaque, loose long-sleeved shirt':'A breathable cotton or linen shirt';
    upperNote=covered?'Try loose sleeves and check opacity in daylight.':'Roll the sleeves if you like; leave room for air to circulate.';
    if(!soft) {bottom='Lightweight, loose trousers';bottomNote='Try linen or a breathable cotton you already own; check transparency and comfort.';}
    shoes=occasion==='work'?'Breathable closed-toe flats':'Supportive sandals or airy trainers';
    finish='An optional light layer';finishNote='Bring a thin layer for air conditioning or a change in temperature.';
  } else if(weather==='cold') {
    upper='A fine knit under an insulated coat';upperNote='Choose insulation for your actual temperature. Leave space for comfortable layering.';
    bottom=soft?'A lined midi skirt with warm tights':easy?'Jeans with a warm base layer':'Warm trousers with an optional base layer';
    bottomNote='Test warmth outdoors briefly before committing to a long day.';
    shoes='Warm boots with suitable grip';shoeNote='Choose soles for the conditions; smooth fashion soles are a poor choice on ice.';
    finish='A scarf, gloves and warm socks';finishNote='Use the same colour family to connect your practical layers.';
  } else if(weather==='wet') {
    upper=covered?'An opaque long-sleeved top under a rain layer':'A simple top under a water-resistant layer';upperNote='Choose weather protection for the rain you expect; a blazer alone is not rainwear.';
    if(soft){bottom='A midi skirt with a clear-of-ground hem';bottomNote='Choose an easy-care fabric and allow comfortable steps.';}
    shoes='Weather-appropriate shoes with grip';shoeNote='Check the maker’s water-resistance claims and avoid absorbent suede in a downpour.';
    bag='A zipped, weather-resistant bag';bagNote='Protect electronics inside a separate waterproof sleeve; zips alone do not make a bag waterproof.';
    finish='A packable umbrella or hood';finishNote='Keep hems off the ground. Your practical layer can be the outfit’s main shape.';
  }
  if(occasion==='work') {
    upperNote+=' Follow your workplace dress requirements.';
    if(weather==='mild') shoes='Loafers or comfortable closed-toe flats';
  }
  if(occasion==='travel') {
    if(weather==='mild'||weather==='warm')shoes='Broken-in walking trainers';
    shoeNote+=' Wear-test the whole outfit while sitting and walking.';
  }
  if(occasion==='dinner'&&weather==='mild') {finish='A small evening accent';finishNote='Repeat one colour in your bag or jewellery. Check the venue’s dress requirements.';}
  const titles={tailored:'Easy polish, from the pieces you own.',easy:'A little ease. A lot of possibility.',soft:'Soft shapes, with a point of view.',covered:'More coverage. Just as much character.'};
  const why=soft?'A defined meeting point between top and skirt gives the softer shapes a clear rhythm. One repeated colour ties the look together.':easy?'A simple upper layer lets the relaxed trousers lead. Repeating a colour in two places makes everyday pieces feel connected.':covered?'Coverage and definition can work together: try one clean shoulder line, comfortable layers and a repeated colour. Adjust the lengths to your preference.':'A clear shoulder line and a relaxed lower half create a calm balance. Two related colours leave room for one deliberate accent.';
  return {title:titles[mood],palette,skirt:soft,outer:weather==='cold'||weather==='wet',
    intro:'A starting formula, not a shopping list. Try the closest pieces in your wardrobe first, then adjust the fit and fabric to your day.',
    pieces:[[upper,upperNote],[bottom,bottomNote],[shoes,shoeNote],[bag,bagNote],[finish,finishNote]],why};
}
