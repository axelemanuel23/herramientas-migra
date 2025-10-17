import React, { useState } from 'react';
import { Calendar, FileText, List, Link, Briefcase } from 'lucide-react';

const ConsultarFuenteButton = ({url}) => {
  return (
    <div className="mt-4 text-center">
      <a
        href={url} // URL general para realizar la consulta manual
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Consultar Fuente
      </a>
    </div>
  )
}

const DayCounter = () => {
  const [transits, setTransits] = useState([{ entry: '', exit: '' }]);
  const [daysLeft, setDaysLeft] = useState("");
  const [entryVisa, setEntryVisa]= useState("");
  const [permanenceDays, setPermanenceDays] = useState("");

  const addTransit = () => {
    setTransits([...transits, { entry: '', exit: '' }]);
  };

  const calculateDays = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    let totalDays = 0;
    let allDates = [];
  
    for (const transit of transits) {
      const entryDate = new Date(transit.entry).setHours(0, 0, 0, 0);
      const exitDate = new Date(transit.exit).setHours(0, 0, 0, 0);
  
      // Check for invalid dates
      if (!transit.entry || !transit.exit) {
        alert("Todas las fechas de entrada y salida deben ser seleccionadas.");
        return;
      }
  
      // Check if entry is after exit
      if (entryDate > exitDate) {
        alert("La fecha de entrada no puede ser posterior a la fecha de salida.");
        return;
      }
  
      // Check if dates are in the future 
      if (entryDate > today || exitDate > today) {
        alert("Las fechas no pueden ser posteriores a la fecha actual.");
        return;
      }
  
      // Check for overlapping transits
      for (const date of allDates) {
        if (
          (entryDate > date.entry && entryDate < date.exit) ||
          (exitDate > date.entry && exitDate < date.exit) ||
          (entryDate <= date.entry && exitDate >= date.exit)
        ) {
          alert("No se permiten transitos solapados.");
          return;
        }
      }
  
      // Add this transit's range to the list of checked dates
      allDates.push({ entry: entryDate, exit: exitDate });
  
      // Calculate days with the rule: if difference is 1 day or more, subtract 1 day
      let difference = entryDate === exitDate ? 1 : (exitDate - entryDate) / (1000 * 60 * 60 * 24) + 1;
      if (difference > 1) difference -= 1;
  
      totalDays += difference;
    }
  
    alert(`Total de días de permanencia: ${totalDays}`);
  };

  const calculateVisa = () => {
    if (!entryVisa) {
      alert("Por favor seleccione una fecha de entrada");
      return;
    }
    if (isNaN(permanenceDays)) {
      alert("Por favor ingrese un número válido de días");
      return;
    }
    const untilWhen = new Date(entryVisa);
    untilWhen.setDate(untilWhen.getDate() + permanenceDays + 1);  
    
    // Formatear la fecha de salida para mostrarla
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDepartureDate = untilWhen.toLocaleDateString('es-ES', options);
  
    alert(formattedDepartureDate)
  }

  const calcularFecha = () => {
    const expiringDate = new Date();

    expiringDate.setDate(expiringDate.getDate() + daysLeft)
    // Formatear la fecha de salida para mostrarla
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDepartureDate = expiringDate.toLocaleDateString('es-ES', options);

    alert(formattedDepartureDate)
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">  
      <Calendar className="w-6 h-6 mb-2 text-blue-500" />
      <h3 className="text-lg font-semibold mb-4">Contador de días</h3>
      {transits.map((transit, index) => (
        <div key={index} className="flex flex-col mb-4 border-b pb-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 pr-2">
              <label className="block text-gray-700 mb-1">Fecha de Ingreso:</label>
              <input
                type="date"
                value={transit.entry}
                onChange={(e) => {
                  const updatedTransits = [...transits];
                  updatedTransits[index].entry = e.target.value;
                  setTransits(updatedTransits);
                }}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1 pl-2">
              <label className="block text-gray-700 mb-1">Fecha de Egreso:</label>
              <input
                type="date"
                value={transit.exit}
                onChange={(e) => {
                  const updatedTransits = [...transits];
                  updatedTransits[index].exit = e.target.value;
                  setTransits(updatedTransits);
                }}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-start mt-4">
        <button
          onClick={addTransit}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600 transition"
        >
          Agregar Tránsito
        </button>
        <button
          onClick={calculateDays}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Calcular Días
        </button>
      </div>
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Calcular fecha según días vigentes</h3>
  <div className="flex items-center gap-3">
    <input 
      type='text'
      onChange={(e) => {
        const value = e.target.value;
        if (!isNaN(value) && value !== '') {
          setDaysLeft(Number.parseInt(value));
        }
      }}
      className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button 
      onClick={calcularFecha}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Calcular fecha
    </button>
  </div>
</div>

<div className="mt-6 p-4 border rounded-lg bg-gray-50">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Calcular desde el primer ingreso:</h3>
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium min-w-[120px]">Fecha de ingreso:</label>
      <input 
        type='date'
        onChange={(e) => {
          setEntryVisa(e.target.value);
        }}
        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium min-w-[120px]">Días de permanencia:</label>
      <input 
        type='text'
        onChange={(e) => {
          const value = e.target.value;
          if (!isNaN(value) && value !== '') {
            setPermanenceDays(Number.parseInt(value));
          }
        }}
        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <button 
      onClick={calculateVisa}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Calcular
    </button>
  </div>
</div>
    </div>
  );
};


const VisaRegime = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [filteredObs, setFilteredObs] = useState([]);


  // Array de ejemplo para visas
  const visas = [
    ["AFGANISTAN", "AFG", "V","V","V"],
    ["ALBANIA", "ALB", "V-AVE", "-", "-"],
    ["ALEMANIA (OCDE)", "DEU", "-", "-", "-"],
    ["ANDORRA", "AND", "-", "-", "-"],
    ["ANGOLA", "AGO", "V-AVE", "-", "-"],
    ["ANTIGUA Y BARBUDA", "ATG", "V-AVE", "-", "-"],
    ["ARABIA SAUDITA", "SAU", "V-AVE", "V", "V", ],
    ["ARGELIA", "DZA", "V", "-", "-"],
    ["ARMENIA", "ARM", "-", "-", "-"],
    ["AUSTRALIA (OCDE)", "AUS", "-", "V", "V"],
    ["AUSTRIA (OCDE)", "AUT",  "-", "-", "-"],
    ["AZERBAIJAN", "AZE", "V", "-", "-"],
    ["BAHAMAS", "BHS", "V-AVE", "-", "-"],
    ["BAHREIN", "BHR", "V-AVE", "V", "V"],
    ["BANGLADESH", "BGD", "V", "-", "-"],
    ["BARBADOS", "BRB", "-", "-", "-"],
    ["BELARUS (BIELORRUSIA)", "BLR", "-/V", "-", "-"],
    ["BELARUS (BIELORRUSIA)", "BLR", "90 DIAS", "EN", "1 AÑO"],
    ["BELGICA (OCDE)", "BEL", "-", "-", "-"],
    ["BELICE", "BLZ", "V-AVE", "-", "-"],
    ["BENIN", "BEN", "V-AVE", "V", "V"],
    ["BHUTAN (BUTÁN)", "BTN", "V-AVE", "V", "V"],
    ["BOLIVIA", "BOL", "-", "-", "-"],
    ["BOSNIA Y HERZEGOVINA", "BIH", "-", "V", "V"],
    ["BOTSWANA", "BWA", "V-AVE", "-", "-"],
    ["BRASIL", "BRA", "-", "-", "-"],
    ["BRUNEI DARUSSALAM", "BRN", "V-AVE", "V", "V"],
    ["BULGARIA", "BGR", "-", "-", "-"],
    ["BULGARIA","90","EN","180","DIAS"],
    ["BURKINA FASO (ex ALTO VOLTA)", "BFA", "V-AVE", "V", "V"],
    ["BURUNDI", "BDI", "V-AVE", "V", "V"],
    ["CABO VERDE", "CPV", "V-AVE", "-", "-"],
    ["CAMBOYA (KAMPUCHEA)", "KHM", "V-AVE", "V", "V"],
    ["CAMERUN", "CMR", "V-AVE", "V", "V"],
    ["CANADA (OCDE)", "CAN", "-", "V", "V"],
    ["COLOMBIA", "COL", "-", "-", "-"],
    ["COMORES, ISLAS", "COM", "V", "V", "V"],
    ["CONGO, REP. DEMOC. del (ex Zaire)", "COD", "V-AVE", "V", "V"],
    ["CONGO, REP. POPULAR. del", "COG", "V-AVE", "V", "V"],
    ["COREA, REP. de (OCDE)", "KOR", "-", "-", "-"],
    ["COREA, REP. DEMOC. Y POP. de", "PRK", "V", "V", "V"],
    ["COSTA DE MARFIL (CÔTE D'IVOIRE)", "CIV", "V-AVE", "V", "V"],
    ["COSTA RICA", "CRI", "-", "-", "-"],
    ["CROACIA", "HRV", "-", "-", "-"],
    ["CUBA", "CUB", "V-AVE", "-", "-", "-"],
    ["CHAD", "TCD", "V", "V", "V"],
    ["CHILE (OCDE)", "CHL", "-", "-", "-",],
    ["CHINA, REP. POPULAR", "CHN", "V*","30 DIAS","30 DIAS"],
    ["CHINA, REP. POPULAR", "CHN", "*Ver Obs","-","-"],
    ["CHIPRE", "CYP", "-", "-", "-"],
    ["DINAMARCA (OCDE)", "DNK", "-", "-", "-"],
    ["DJIBOUTI", "DJI", "V-AVE", "V", "V"],
    ["DOMINICA", "DMA", "-", "-", "-"],
    ["ECUADOR", "ECU", "-", "-", "-"],
    ["EGIPTO", "EGY", "V", "-", "-"],
    ["EGIPTO", "15", "DIAS", "RTU", ""],
    ["EL SALVADOR", "SLV", "-", "-", "-"],
    ["EMIRATOS ARABES UNIDOS", "ARE", "-", "-", "-"],
    ["ERITREA", "ERI", "V-AVE", "V", "V"],
    ["ESLOVENIA (OCDE)", "SVN", "-", "-", "-"],
    ["ESPAÑA (OCDE)", "ESP", "-", "-", "-"],
    ["ESTADOS UNIDOS DE AMERICA(OCDE)", "USA", "-", "V", "V"],
    ["ESTONIA (OCDE)", "EST", "-", "-", "-"],
    ["ESWATINI", " ", "V-AVE", "V", "V"],
    ["ETIOPIA", "ETH", "V-AVE", "V", "V"],
    ["FEDERACION RUSA", "RUS", "-", "-", "-"],
    ["FEDERACION RUSA", "90", "EN", "180", "DIAS"],
    ["FIJI", "FJI", "-", "-", "-"],
    ["FILIPINAS", "PHL", "V-AVE", "-", "-"],
    ["FILIPINAS","60","DIAS","RTU",""],
    ["FINLANDIA (OCDE)", "FIN", "-", "-", "-"],
    ["FRANCIA (OCDE)", "FRA", "-", "-", "-"],
    ["GABON", "GAB", "V-AVE", "V", "V"],
    ["GAMBIA", "GMB", "V-AVE", "V", "V"],
    ["GEORGIA", "GEO", "-", "-", "-"],
    ["GEORGIA", "90", "EN", "180","DIAS"],
    ["GHANA", "GHA", "V-AVE", "V", "V"],
    ["GRANADA (GRENADA)", "GRD", "-", "-", "-"],
    ["GRECIA (OCDE)", "GRC", "-", "-", "-"],
    ["GUATEMALA", "GTM", "-", "-", "-"],
    ["GUINEA", "GIN", "V-AVE", "V", "V"],
    ["GUINEA-BISSAU", "GNB", "V-AVE", "V", "V"],
    ["GUINEA ECUATORIAL", "GNQ", "V-AVE", "V", "V"],
    ["GUYANA", "GUY", "-", "-", "-"],
    ["HAITI", "HTI", "V", "-", "-"],
    ["HONDURAS", "HND", "-", "-", "-"],
    ["HONG KONG con Pte. Británico B.N.O.", "GBN", "-", "-", "-"],
    ["HONG KONG con nuevo Pte. S.A.R.", "HKG", "-", "-", "-"],
    ["HUNGRIA (OCDE)", "HUN", "-", "-", "-"],
    ["INDIA", "IND", "V-AVE*", "-", "-"],
    ["INDIA", "IND", "*Ver Obs", "-", "-"],
    ["INDONESIA", "IDN", "V-AVE", "-", "-"],
    ["INDONESIA", "30", "DIAS", "RTU", ""],
    ["INTERPOL", "XPO", "V", "-", "-"],
    ["IRAK", "IRQ", "V", "V", "V"],
    ["IRAN", "IRN", "V", "V", "V"],
    ["IRLANDA (OCDE)", "IRL", "-", "V", "V"],
    ["ISLANDIA (OCDE)", "ISL", "-", "-", "-"],
    ["ISRAEL (OCDE)", "ISR", "-", "-", "-"],
    ["ITALIA (OCDE)", "ITA", "-", "-", "-"],
    ["JAMAICA", "JAM", "-", "-", "-"],
    ["JAPON (OCDE)", "JPN", "-", "-", "-"],
    ["JORDANIA", "JOR", "V", "V", "V"],
    ["KAZAJSTAN", "KAZ", "-/V", "-", "-"],
    ["KAZAJSTAN", "KAZ", "", "90 Dias", ""],
    ["KAZAJSTAN", "KAZ", "30 DIAS INTERRUMPIBLES EN 1 AÑO / VISADO", "", ""],
    ["KENYA", "KEN", "V-AVE", "V", "V"],
    ["KIRGUISTAN", "KGZ", "V", "V", "V"],
    ["KIRIBATI", "KIR", "V-AVE", "V", "V"],
    ["KOSOVO", "XKK", "C/V", "x", "x"],
    ["KUWAIT", "KWT", "V", "V", "V"],
    ["LAOS (LAO)", "LAO", "V-AVE", "V", "V"],
    ["LESOTHO", "LSO", "V-AVE", "V", "V"],
    ["LETONIA (LATVIA) (OCDE)", "LVA", "-", "-", "-"],
    ["LIBANO", "LBN", "V", "V", "V"],
    ["LIBERIA", "LBR", "V", "V", "V"],
    ["LIBIA", "LBY", "V", "V", "V"],
    ["LIECHTENSTEIN", "LIE", "-", "-", "-"],
    ["LITUANIA", "LTU", "-", "-", "-"],
    ["LUXEMBURGO (OCDE)", "LUX", "-", "-", "-"],
    ["MACAO", "MAC", "-", "X","X"],
    ["MACEDONIA, ex Rep. Yugoslava de", "MKD", "-", "-","-"],
    ["MACEDONIA, ex Rep. Yugoslava de", "90", "EN", "180","DIAS"],
    ["MADAGASCAR", "MDG", "V-AVE", "V", "V"],
    ["MALASIA", "MYS", "-","-","-"],
    ["MALASIA", "MYS", "30","DIAS","RTU"],
    ["MALAWI", "MWI", "V-AVE", "V", "V"],
    ["MALDIVAS", "MDV", "V-AVE", "V", "V"],
    ["MALI", "MLI", "V", "V", "V"],
    ["MALTA, REPÚBLICA DE", "MLT", "-","-","-"],
    ["MALTA, Soberana Orden Militar de (Dto. N° 285/98)", "XOM", "x","-","-"],
    ["MARSHALL, ISLAS", "MHL", "V-AVE", "V", "V"],
    ["MARRUECOS", "MAR", "V","-","-"],
    ["MAURICIO", "MUS", "V-AVE", "V", "V"],
    ["MAURITANIA", "MRT", "V", "V", "V"],
    ["MEXICO (OCDE)", "MEX", "-","-","-"],
    ["MICRONESIA, Estados Federados de", "FSM", "V", "V", "V"],
    ["MOLDOVA", "MDA", "V-AVE", "V", "V"],
    ["MONACO", "MCO", "-","-","-"],
    ["MONGOLIA", "MNG", "-", "-", "-"],
    ["MONTENEGRO", "MNE", "-","-", "-"],
    ["MOZAMBIQUE", "MOZ", "V-AVE","-","-"],
    ["MYANMAR (ex BIRMANIA)", "MMR", "V-AVE", "V", "V"],
    ["NAMIBIA", "NAM", "V-AVE", "V", "V"],
    ["NAURU", "NRU", "YAREN", "V-AVE", "V", "V"],
    ["NEPAL", "NPL", "KATMANDÚ", "V-AVE", "V", "V"],
    ["NICARAGUA", "NIC",  "-", "-", "-"],
    ["NIGER", "NER",  "V-AVE", "V", "V"],
    ["NIGERIA", "NGA", "V", "V", "V"],
    ["NORUEGA (OCDE)", "NOR",  "-", "-", "-"],
    ["NUEVA ZELANDIA (OCDE)", "NZL", "-", "-", "-"],
    ["OMAN", "OMN", "MASCATE", "V-AVE", "V", "V"],
    ["PAISES BAJOS (OCDE)", "NLD", "-", "-", "-"],
    ["PAKISTAN", "PAK", "V", "-", "-"],
    ["PALAU", "PLW", "V-AVE", "V", "V"],
    ["PALESTINA", "PSE", "V", "V", "V"],
    ["PANAMA", "PAN", "-", "-", "-"],
    ["PAPUA NUEVA GUINEA", "PNG", "V-AVE", "V", "V"],
    ["PARAGUAY", "PRY", "-", "-", "-"],
    ["PERU", "PER", "-", "-", "-"],
    ["POLONIA (OCDE)", "POL", "-", "-", "-"],
    ["PORTUGAL (OCDE)", "PRT", "-", "-", "-"],
    ["PUERTO RICO", "PRI", "-", "V", "V"],
    ["QATAR", "QAT", "-", "-", "-"],
    ["REINO UNIDO de GRAN BRETAÑA e IRLANDA DEL NORTE (OCDE)", "GBR", "-", "-", "-"],
    ["REPUBLICA ÁRABE SAHARAUI DEMOCRÁTICA (ex SAHARA OCCIDENTAL)", "ESH", "C/V","x","x"],
    ["REPUBLICA CENTRO AFRICANA", "CAF", "V-AVE", "V", "V"],
    ["REPUBLICA CHECA (OCDE)", "CZE", "-","-","-"],
    ["REPUBLICA DOMINICANA", "DOM", "V*", "-","-"],
    ["REPUBLICA DOMINICANA", "DOM", "*Ver Obs", "-","-"],
    ["REPUBLICA ESLOVACA (OCDE)", "SVK", "-","-","-"],
    ["REPUBLICA MOLDAVA NISTRINA", "x", "-","-","-"],
    ["RUMANIA", "ROU", "-","-","-"],
    ["RUMANIA","90","EN","180","DIAS"],
    ["RWANDA / RUANDA", "RWA", "V-AVE", "V", "V"],  
    ["SALOMON, ISLAS", "SLB", "V-AVE", "V", "V"],
    ["SAMOA OCCIDENTAL", "WSM", "V-AVE", "V", "V"],
    ["SAN CRISTOBAL Y NEVIS", "KNA", "-","-","-"],
    ["SAN MARINO", "SMR", "-","-","-"],
    ["SANTA LUCIA", "LCA", "-","-","-"],
    ["SANTA SEDE (ver VATICANO)", "VAT","x", "-","-"],
    ["SANTO TOME Y PRÍNCIPE", "STP", "V-AVE", "V", "V"],
    ["SAN VICENTE Y LAS GRANADINAS", "VCT", "-","-","-"],
    ["SENEGAL", "SEN", "V-AVE", "V", "V"],
    ["SERBIA", "SRB", "-","-","-"],
    ["SEYCHELLES", "SYC", "V-AVE", "V", "V"],
    ["SIERRA LEONA", "SLE", "V-AVE", "V", "V"],
    ["SINGAPUR", "SGP", "-","-","-"],
    ["SIRIA", "SYR", "V","V","V"],
    ["SOMALIA", "SOM", "V", "V", "V"],
    ["SRI LANKA", "LKA", "V","V","V"],
    ["SUDAFRICA, REP. de", "ZAF", "-"],
    ["SUDAN, REPÚBLICA DEL", "SDN", "V", "V", "V"],
    ["SUDAN DEL SUR (Dto. Nº 1.072/11)", "SSD", "V", "V", "V"],
    ["SUECIA (OCDE)", "SWE", "-","-","-"],
    ["SUIZA (OCDE)", "CHE", "-","-","-"],
    ["SURINAME", "SUR", "-","-","-"],
    ["SWAZILANDIA (VER ESWATINI) ", "SWZ", "V-AVE", "V", "V"],
    ["TAILANDIA", "THA", "-","-","-"],
    ["TAIWAN", "TWN", "C/V - AVE","x","x"],
    ["TANZANIA", "TZA", "V-AVE", "V", "V"],
    ["TAYIKISTAN", "TJK", "V", "V", "V"],
    ["TIMOR-LESTE (ex Timor Oriental)", "TLS", "V", "V", "V"],
    ["TOGO", "TGO", "V-AVE", "V", "V"],
    ["TONGA", "TON", "V-AVE", "V", "V"],
    ["TRINIDAD Y TOBAGO", "TTO", "-","-","-"],
    ["TUNEZ", "TUN", "V", "-","-"],
    ["TURKMENISTAN", "TKM", "V", "V", "V"],
    ["TURQUIA (OCDE)", "TUR", "-","-","-"],
    ["TUVALU", "TUV", "V-AVE", "V", "V"],
    ["UCRANIA", "UKR", "-","-","-"],
    ["UCRANIA", "90", "EN","180","DIAS"],
    ["UGANDA", "UGA", "V-AVE", "V", "V"],
    ["URUGUAY", "URY", "-","-","-"],
    ["UZBEKISTAN", "UZB", "V", "V", "V"],
    ["VANUATU", "VUT", "V-AVE", "V", "V"],
    ["VATICANO (ver SANTA SEDE)", "VAT", "-","x","x"],
    ["VENEZUELA", "VEN", "-","-","-"],
    ["VIETNAM", "VNM", "V-AVE", "-","-"],
    ["YEMEN", "YEM", "V", "V", "V"],
    ["ZAMBIA", "ZMB", "V-AVE", "V", "V"],
    ["ZIMBABWE", "ZWE", "V-AVE", "V", "V"],
  ];

  const obs = [
    { pais: "CHINA", codigo: "CHN", texto: "Mediante RESOL-2025-316-APN-VGI JGM-Resolución N° 316 del 18 de julio de 2025, se resuelve ARTÍCULO 1°.- Autorízase el ingreso sin visado consular argentino ni Autorización de Viaje Electrónica (AVE), a los extranjeros nacionales de la REPÚBLICA POPULAR DE CHINA, titulares de pasaporte ordinario, cuando el mismo se produzca con la presentación de visado válido y vigente para el ingreso a los ESTADOS UNIDOS DE AMÉRICA correspondiente a similar categoría migratoria. En el caso de los nacionales de la REPÚBLICA POPULAR DE CHINA, resultarán comprendidos en el referido beneficio las subcategorías migratorias del artículo 24 de la Ley N° 25.871, inciso a) -turistas- y h) Disposición N° 1171/10 -hombre de negocios-, con un plazo de permanencia máximo autorizado de hasta TREINTA (30) días." },
    { pais: "INDIA", codigo: "IND", texto: "Mediante RESOL-2025-353-APN-VGI#JGM-Resolución N° 353 del 26 de agosto de 2025 (entra en vigencia a partir del 28/07/2025), se resuelve ARTÍCULO 1°.- Autorízase el ingreso sin visado consular argentino ni Autorización de Viaje Electrónica (AVE), a los extranjeros nacionales de la REPÚBLICA DE LA INDIA, titulares de pasaporte ordinario, cuando el mismo se produzca con la presentación de visado válido y vigente para el ingreso a los ESTADOS UNIDOS DE AMÉRICA correspondiente a similar categoría migratoria, previa verificación de las mismas con las autoridades pertinentes y su ingreso al país se efectuare en carácter transitorio en los términos del inciso a) -Turistas- del artículo 24 de la Ley N° 25.871 y sus modificatorios, con un plazo de hasta NOVENTA (90) días de permanencia." },
    { pais: "REOUBLICA DOMINICANA", codigo: "DOM", texto: "Mediante RESOL-2025-316-APN-VGI#JGM-Resolución N° 316 del 18 de julio de 2025 (entra en vigencia a partir del 22/07/2025), se resuelve: ARTÍCULO 1°.- Autorízase el ingreso sin visado consular argentino ni Autorización de Viaje Electrónica (AVE), a los extranjeros nacionales de la REPÚBLICA DOMINICANA, titulares de pasaporte ordinario, cuando el mismo se produzca con la presentación de visado válido y vigente para el ingreso a los ESTADOS UNIDOS DE AMÉRICA correspondiente a similar categoría migratoria. Los nacionales de la REPÚBLICA DOMINICANA accederán a la exención cuando su ingreso al país se efectúe exclusivamente en carácter transitorio en los términos del inciso a) del artículo 24 de la Ley N° 25.871, con un plazo de hasta NOVENTA (90) días de permanencia"},
  ];

  const handleSearch = (e) => {
  const value = e.target.value.toLowerCase();
  setSearch(value);

  if (value.length >= 3) {
    const filtered = visas.filter(visa =>
      visa.some(itemValue =>
        String(itemValue).toLowerCase().includes(value)
      )
    );
    setResults(filtered);

    const obsFiltradas = obs.filter(o =>
      o.pais.toLowerCase().includes(value) ||
      o.codigo.toLowerCase().includes(value)
    );
    setFilteredObs(obsFiltradas);
  } else {
    setResults([]);
    setFilteredObs([]);
  }
};


  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Briefcase className="w-6 h-6 mb-2 text-green-500" />
      <h3 className="text-lg font-semibold">Régimen de visa</h3>
      <div className="mt-2">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar visa..."
          className="w-full p-2 border rounded"
        />
      </div>
      {results.length > 0 && (
        <table className="w-full mt-2">
          <thead>
            <tr>
              <th className="text-left">Pais</th>
              <th className="text-left">Codigo</th>
              <th className="text-left">Turista</th>
              <th className="text-left">Diplomatico</th>
              <th className="text-left">Oficial</th>
            </tr>
          </thead>
          <tbody>
            {results.map((visa, index) => (
              <tr key={index}>
              <td>{visa[0]}</td>
              <td>{visa[1]}</td>
                <td>{visa[2]}</td>
                <td>{visa[3]}</td>
                <td>{visa[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {filteredObs.length > 0 && (
  <div className="mt-4">
    <h4 className="text-md font-semibold">Observaciones adicionales</h4>
    <ul className="list-disc pl-5 text-sm text-gray-700">
      {filteredObs.map((o, index) => (
        <li key={index}>{o.pais}:{o.texto}</li>
      ))}
    </ul>
  </div>
)}
      <ConsultarFuenteButton url={"https://dirnacmigraciones-my.sharepoint.com/:b:/g/personal/aepavon_migraciones_gob_ar/EROPWwpyDnBEutGUWT5kMw0B_b892UGcSf1wC-9Rp9kjkw?e=8qBDVW"} />
    </div>
  );
};

const Agreements = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  // Array de ejemplo para convenios
  const convenios = [
    {
      name: "Tratado de Facilitacion Turistica TFT",
      documentCountry: ["BRASIL"],
      beneficiaryCountry: [""],
      detail: "Un ciudadano con residencia permanente cuya nacionalidad requiera visado puede ingresar con Cartera de Habilitacion Nacional por un plazo máximo de 72 horas"
    },
    {
      name: "Argentina - Chile",
      documentCountry: ["Chile"],
      beneficiaryCountry: [""],
      detail: "Un ciudadano con residencia permanente cuya nacionalidad requiera visado puede ingresar con Cedula de Identidad Chilena"
    },
    {
      name: "San Borja",
      documentCountry: ["Brasil"],
      beneficiaryCountry: ["Brasil"],
      detail: "...."
    }
  ];

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (value.length >= 3) {
      const filtered = convenios.filter((convenio) =>
        convenio.name.toLowerCase().includes(value) ||
        convenio.documentCountry.some(country => 
          country.toLowerCase().includes(value)
        ) ||
        convenio.detail.toLowerCase().includes(value)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <FileText className="w-6 h-6 mb-2 text-yellow-500" />
      <h3 className="text-lg font-semibold">Convenios</h3>
      <div className="mt-2">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar convenio..."
          className="w-full p-2 border rounded mb-4"
        />
      </div>
      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full mt-2 table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border-b font-medium">Nombre del Convenio</th>
                <th className="p-2 border-b font-medium">País Documento</th>
                <th className="p-2 border-b font-medium">Paises Beneficiados</th>
                <th className="p-2 border-b font-medium">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {results.map((convenio, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{convenio.name}</td>
                  <td className="p-2 border-b">{convenio.documentCountry.join(', ')}</td>
                  <td className="p-2 border-b">{convenio.beneficiaryCountry.join(', ')}</td>
                  <td className="p-2 border-b">{convenio.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {results.length === 0 && search.length >= 3 && (
        <p className="mt-4 text-center text-gray-500">No se encontraron convenios que coincidan con la búsqueda.</p>
      )}
      <ConsultarFuenteButton url={"https://dirnacmigraciones-my.sharepoint.com/:b:/g/personal/aepavon_migraciones_gob_ar/EaCzFJidcB9OqIhou7GFA1sBQayzZ4aJcpStp-aqWQjXEw?e=Myhent"}/>
    </div>
  );
};

const Categorization = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  // Array de ejemplo para categorías
  const categories = [
    ["BRASIL", "BRA", "NO" ,"ARE 180","ARE 180","AR"],
    ["PARAGUAY", "PRY", "NO" ,"ARE 180","ARE 180","AR"],
    ["URUGUAY", "URY", "NO" ,"ARE 180","ARE 180","AR"],
    ["BOLIVIA", "BOL", "NO" ,"ARE 180","ARE 180","AR"],
    ["PERU", "PER", "NO" ,"ARE 180","ARE 180","AR"],
    ["VENEZUELA", "VEN", "NO" ,"ARE 180","ARE 180","AR"],
    ["CHILE", "CHL", "SI" ,"RTU 90","RTU 90","AR"],
    ["COLOMBIA", "COL", "SI" ,"RTU 90","RTU 90","AR"],
    ["ECUADOR", "ECU", "SI" ,"RTU 90","RTU 90","AR"],
    ["ESPAÑA", "ESP", "SI" ,"-","RTU 90","-"],
    ["ITALIA", "ITA", "SI" ,"-","RTU 90","-"],
    ["NORUEGA", "NOR", "SI" ,"-","RTU 90","-"],
    ["SUECIA", "SWE", "SI" ,"-","RTU 90","-"],
    ["PANAMA", "PAN", "SI" ,"-","RTU 90","-"],
    ["EL SALVADOR", "SLV", "SI" ,"-","RTU 90","-"],
    ["HONDURAS", "HND", "SI" ,"-","RTU 90","-"],
    ["NICARAGUA", "NIC", "SI" ,"-","RTU 90","-"],
    ["ESTADOS UNIDOS", "USA", "SI (Antes del '81)" ,"-","RTU 90","-"],
    ["ESTADOS UNIDOS", "USA", "No (Despues del '81)" ,"-","ARE 180","-"],
    ["FRANCIA", "FRA", "NO" ,"-","ARE 180","-"],
    ["MEXICO", "MEX", "NO" ,"-","ARE 180","-"],
    ["CANADA", "CAN", "NO" ,"-","ARE 180","-"],
    ["SUIZA", "CHE", "NO" ,"-","ARE 180","-"],
    ["RUSIA", "RUS", "NO" ,"-","ARE 180","-"],
    ["DINAMARCA", "DNK", "NO" ,"-","ARE 180","-"],
    ["OTROS", "-", "NO" ,"-","ARE 180","-"],
];

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (value.length >= 3) {
      const filtered = categories.filter(category => 
        category.some((itemValue) => 
          String(itemValue).toLowerCase().includes(value)
        )
      );
      setResults(filtered);
      // Si no se encontraron resultados, establecer un valor por defecto
      if (filtered.length === 0) {
        setResults(categories.filter(category => 
          category.some((itemValue) => 
            String(itemValue).toLowerCase().includes("otro")
          )
        ));
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <List className="w-6 h-6 mb-2 text-purple-500" />
      <h3 className="text-lg font-semibold">Categorización</h3>
      <div className="mt-2">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar pais emisor del documento..."
          className="w-full p-2 border rounded"
        />
      </div>
      {results.length > 0 && (
        <table className="w-full mt-2">
          <thead>
            <tr>
              <th className="text-left">Pais</th>
              <th className="text-left">Codigo</th>
              <th className="text-left">Convenio?</th>
              <th className="text-left">Cedula de Identida</th>
              <th className="text-left">Pasaporte</th>
              <th className="text-left">Cedula de Residente</th>
            </tr>
          </thead>
          <tbody>
            {results.map((category, index) => (
              <tr key={index}>
              <td>{category[0]}</td>
              <td>{category[1]}</td>
              <td>{category[2]}</td>
              <td>{category[3]}</td>
              <td>{category[4]}</td>
              <td>{category[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ConsultarFuenteButton url={"https://dirnacmigraciones-my.sharepoint.com/:b:/g/personal/aepavon_migraciones_gob_ar/EfrcgdXy3XZHp0_0V3j_wIYBrcgfDgOD040nMXxoZXFooQ?e=M1axfU"}/>
    </div>
  );
};

// Componente de salida
const OutputCard = ({ title, url }) => (
  <a 
    href={url} 
    className="block p-4 bg-white rounded-lg shadow transition-shadow transform hover:shadow-lg hover:scale-105"
  >
    <Link className="w-6 h-6 mb-2 text-gray-500" />
    <h3 className="text-lg font-semibold">{title}</h3>
  </a>
);

// Componente principal
const App = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const renderSelectedTool = () => {
    switch (selectedTool) {
      case 'DayCounter':
        return <DayCounter />;
      case 'VisaRegime':
        return <VisaRegime />;
      case 'Agreements':
        return <Agreements />;
      case 'Categorization':
        return <Categorization />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Herramientas Migraciones</h1>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-4">Entrada</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={() => setSelectedTool('DayCounter')}>
              <div className="p-4 bg-white rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg">
                <Calendar className="w-6 h-6 mb-2 text-blue-500" />
                <h3 className="text-lg font-semibold">Contador de días</h3>
              </div>
            </button>
            <button onClick={() => setSelectedTool('VisaRegime')}>
              <div className="p-4 bg-white rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg">
                <Briefcase className="w-6 h-6 mb-2 text-green-500" />
                <h3 className="text-lg font-semibold">Régimen de Visas</h3>
              </div>
            </button>
            <button onClick={() => setSelectedTool('Agreements')}>
              <div className="p-4 bg-white rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg">
                <FileText className="w-6 h-6 mb-2 text-yellow-500" />
                <h3 className="text-lg font-semibold">Convenios</h3>
              </div>
            </button>
            <button onClick={() => setSelectedTool('Categorization')}>
              <div className="p-4 bg-white rounded-lg shadow transition-transform transform hover:scale-105 hover:shadow-lg">
                <List className="w-6 h-6 mb-2 text-purple-500" />
                <h3 className="text-lg font-semibold">Categorización de Argentinos</h3>
              </div>
            </button>
          </div>
             
        </div>
  
        {selectedTool && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Herramienta Seleccionada</h2>
            {renderSelectedTool()}
          </div>
        )}
<div className="mt-8 space-y-4">
            <OutputCard title="Link para consulta de registros migratorios (Particulares)" url="https://www.migraciones.gob.ar/transitos/" />
            <OutputCard title="Consulta de expedientes - Colombia" url="https://procesos.ramajudicial.gov.co/jepms/bogotajepms/conectar.asp" />
            <OutputCard title="Consulta de antecedentes judiciales - Colombia" url="https://antecedentes.policia.gov.co:7005/WebJudicial/index.xhtml" />
          </div>   
  
        <div>
          <h2 className="text-2xl font-semibold mb-4 mt-4">Salida</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <OutputCard title="Validaciòn de Documentos Provincia de San Juan" url="https://validacion.sanjuan.gob.ar/" />
            <OutputCard title="Partida de Nacimiento Provincia de Buenos Aires" url="https://www.gdeba.gba.gob.ar/consultagedo/" />
            <OutputCard title="Portal de Autenticidad Ciudad de Buenos Aires" url="https://buenosaires.gob.ar/inicio/portal-autenticidad" />
            <OutputCard title="Verificacion de Apostilla o Legalizacion" url="https://www.argentina.gob.ar/relacionesexterioresyculto/legalizacion-internacional" />
            <OutputCard title="Consultar Último Ejemplar DNI" url="https://tramites.renaper.gob.ar/mi_ejemplar/" />
            <OutputCard title="Plantillas para Incidentes" url="https://dirnacmigraciones-my.sharepoint.com/:x:/g/personal/aepavon_migraciones_gob_ar/EfkhA4-i615IhMTfJ11ZEDYBmNtOsCqT__BJqJJTkhDrUg?e=oD9grn" />
            
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
