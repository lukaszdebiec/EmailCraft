export const LANGUAGES = [
  { id: 'english', label: 'English', isDefault: true },
  { id: 'spanish', label: 'Spanish' },
  { id: 'german', label: 'German' },
  { id: 'dutch', label: 'Dutch' },
  { id: 'swedish', label: 'Swedish' },
  { id: 'finnish', label: 'Finnish' },
] as const;

export type LanguageId = typeof LANGUAGES[number]['id'];

// Default language for fallbacks
export const DEFAULT_LANGUAGE: LanguageId = 'english';

export type TranslationMap = Record<LanguageId, Record<string, string>>;

export const TRANSLATIONS: TranslationMap = {
  english: {
    'header-invitation': 'It is time to book your appointment',
    'body-invitation': 'Below you can find a button that will lead you to the appointment page.',
    'footer-invitation': 'You will get a confirmation email. In case of any questions do not hesitate to ask our awesome support team.',
    'cta-book': 'Book Appointment Now',
    'greetings': 'Hello {{name}}!',
    'explanation': 'You are getting this email because you have been selected for our program.',
    'call-to-action': 'You need to register your application by using the button below.',
    'footer': 'Thank you for your participation.',
  },
  spanish: {
    'header-invitation': 'Es hora de programar su cita',
    'body-invitation': 'A continuación encontrará un botón que le llevará a la página de citas.',
    'footer-invitation': 'Recibirá un correo electrónico de confirmación. En caso de cualquier duda no dude en consultar con nuestro fantástico equipo de soporte.',
    'cta-book': 'Programar Cita Ahora',
    'greetings': '¡Hola {{name}}!',
    'explanation': 'Recibe este correo electrónico porque ha sido seleccionado para nuestro programa.',
    'call-to-action': 'Debe registrar su solicitud utilizando el botón de abajo.',
    'footer': 'Gracias por su participación.',
  },
  german: {
    'header-invitation': 'Es ist Zeit, Ihren Termin zu buchen',
    'body-invitation': 'Unten finden Sie eine Schaltfläche, die Sie zur Terminseite führt.',
    'footer-invitation': 'Sie erhalten eine Bestätigungs-E-Mail. Bei Fragen zögern Sie nicht, unser tolles Support-Team zu fragen.',
    'cta-book': 'Termin Jetzt Buchen',
    'greetings': 'Hallo {{name}}!',
    'explanation': 'Sie erhalten diese E-Mail, weil Sie für unser Programm ausgewählt wurden.',
    'call-to-action': 'Sie müssen Ihre Anmeldung über die untenstehende Schaltfläche registrieren.',
    'footer': 'Vielen Dank für Ihre Teilnahme.',
  },
  dutch: {
    'header-invitation': 'Het is tijd om uw afspraak te maken',
    'body-invitation': 'Hieronder vindt u een knop die u naar de afsprakenpagina leidt.',
    'footer-invitation': 'U ontvangt een bevestigingsmail. Aarzel bij vragen niet om het aan ons geweldige supportteam te vragen.',
    'cta-book': 'Nu Afspraak Boeken',
  },
  swedish: {
    'header-invitation': 'Det är dags att boka din tid',
    'body-invitation': 'Nedan hittar du en knapp som leder dig till bokningssidan.',
    'footer-invitation': 'Du kommer att få ett bekräftelsemail. Om du har några frågor tveka inte att fråga vårt fantastiska supportteam.',
    'cta-book': 'Boka Tid Nu',
  },
  finnish: {
    'header-invitation': 'On aika varata aikasi',
    'body-invitation': 'Alta löydät painikkeen, joka vie sinut ajanvaraussivulle.',
    'footer-invitation': 'Saat vahvistussähköpostin. Jos sinulla on kysyttävää, älä epäröi kysyä mahtavalta tukitiimiltämme.',
    'cta-book': 'Varaa Aika Nyt',
  },
};

/**
 * Translates a text containing translation keys like {{key}}
 * Supports fallback to English if a key is missing in the target language.
 * Supports parameter interpolation if params are provided.
 */
export const translate = (
  text: string, 
  lang: LanguageId = DEFAULT_LANGUAGE, 
  params: Record<string, string> = {},
  translations: TranslationMap = TRANSLATIONS
): string => {
  if (!text) return text;
  
  let result = text;

  // 1. First, replace translation keys: {{header-invitation}}
  result = result.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    
    // Skip if it looks like a parameter (handled in step 2)
    if (params[trimmedKey] !== undefined) return match;

    // Get translation with fallback
    const translatedValue = translations[lang]?.[trimmedKey] || translations[DEFAULT_LANGUAGE][trimmedKey];
    
    return translatedValue !== undefined ? translatedValue : match;
  });

  // 2. Then, replace parameters: {{name}}
  Object.entries(params).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, value);
  });

  return result;
};
