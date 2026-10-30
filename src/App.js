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
          alert("No se permiten tránsitos solapados.");
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


// Normaliza texto para comparar sin distinguir mayúsculas ni tildes
const normalizar = (texto) =>
  String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const VisaRegime = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [filteredObs, setFilteredObs] = useState([]);
  const [procedimientosAplicables, setProcedimientosAplicables] = useState([]);
  // Estado manual de los desplegables: { [id]: true/false }. Si no hay valor, rige el valor por defecto.
  const [abiertos, setAbiertos] = useState({});


  // Array de ejemplo para visas
  const visas = [
    ["AFGANISTÁN", "AFG", "V","V","V","CONSULTA"],
    ["ALBANIA", "ALB", "V-AVE", "-", "-",""],
    ["ALEMANIA (OCDE)", "DEU", "-", "-", "-",""],
    ["ANDORRA", "AND", "-", "-", "-",""],
    ["ANGOLA", "AGO", "V-AVE", "-", "-",""],
    ["ANTIGUA Y BARBUDA", "ATG", "V-AVE", "-", "-",""],
    ["ARABIA SAUDITA", "SAU", "V-AVE", "V", "V","CONSULTA"],
    ["ARGELIA", "DZA", "V", "-", "-","CONSULTA"],
    ["ARMENIA", "ARM", "-", "-", "-",""],
    ["AUSTRALIA (OCDE)", "AUS", "-", "V", "V",""],
    ["AUSTRIA (OCDE)", "AUT",  "-", "-", "-",""],
    ["AZERBAIJAN", "AZE", "V", "-", "-","CONSULTA"],
    ["BAHAMAS", "BHS", "V-AVE", "-", "-",""],
    ["BAHREIN", "BHR", "V-AVE", "V", "V",""],
    ["BANGLADESH", "BGD", "V", "-", "-","INFORMATIVO"],
    ["BARBADOS", "BRB", "-", "-", "-",""],
    ["BELARÚS (BIELORRUSIA)", "BLR", "*Ver Obs/V", "-", "-",""],
    ["BÉLGICA (OCDE)", "BEL", "-", "-", "-",""],
    ["BELICE", "BLZ", "V-AVE", "-", "-",""],
    ["BENIN", "BEN", "V-AVE", "V", "V",""],
    ["BHUTAN (BUTÁN)", "BTN", "V-AVE", "V", "V",""],
    ["BOLIVIA", "BOL", "-", "-", "-",""],
    ["BOSNIA Y HERZEGOVINA", "BIH", "-", "V", "V",""],
    ["BOTSWANA", "BWA", "V-AVE", "-", "-",""],
    ["BRASIL", "BRA", "-", "-", "-",""],
    ["BRUNEI DARUSSALAM", "BRN", "V-AVE", "V", "V","INFORMATIVO"],
    ["BULGARIA", "BGR", "*Ver Obs", "-", "-",""],
    ["BURKINA FASO (ex ALTO VOLTA)", "BFA", "V-AVE", "V", "V",""],
    ["BURUNDI", "BDI", "V-AVE", "V", "V",""],
    ["CABO VERDE", "CPV", "V-AVE", "-", "-",""],
    ["CAMBOYA (KAMPUCHEA)", "KHM", "V-AVE", "V", "V",""],
    ["CAMERÚN", "CMR", "V-AVE", "V", "V",""],
    ["CANADÁ (OCDE)", "CAN", "-", "V", "V",""],
    ["COLOMBIA", "COL", "-", "-", "-","VERIFICACION"],
    ["COMORES, ISLAS", "COM", "V", "V", "V","CONSULTA"],
    ["CONGO, REP. DEMOC. del (ex Zaire)", "COD", "V-AVE", "V", "V",""],
    ["CONGO, REP. POPULAR. del", "COG", "V-AVE", "V", "V",""],
    ["COREA, REP. de (OCDE)", "KOR", "-", "-", "-",""],
    ["COREA, REP. DEMOC. Y POP. de", "PRK", "V", "V", "V",""],
    ["COSTA DE MARFIL (CÔTE D'IVOIRE)", "CIV", "V-AVE", "V", "V",""],
    ["COSTA RICA", "CRI", "-", "-", "-",""],
    ["CROACIA", "HRV", "-", "-", "-",""],
    ["CUBA", "CUB", "V-AVE", "-", "-",""],
    ["CHAD", "TCD", "V", "V", "V",""],
    ["CHILE (OCDE)", "CHL", "-", "-", "-",""],
    ["CHINA, REP. POPULAR", "CHN", "*Ver Obs","-","-",""],
    ["CHIPRE", "CYP", "-", "-", "-",""],
    ["DINAMARCA (OCDE)", "DNK", "-", "-", "-",""],
    ["DJIBOUTI", "DJI", "V-AVE", "V", "V",""],
    ["DOMINICA", "DMA", "-", "-", "-",""],
    ["ECUADOR", "ECU", "-", "-", "-",""],
    ["EGIPTO", "EGY", "*Ver Obs/V", "-", "-","INFORMATIVO"],
    ["EL SALVADOR", "SLV", "-", "-", "-",""],
    ["EMIRATOS ÁRABES UNIDOS", "ARE", "-", "-", "-",""],
    ["ERITREA", "ERI", "V-AVE", "V", "V",""],
    ["ESLOVENIA (OCDE)", "SVN", "-", "-", "-",""],
    ["ESPAÑA (OCDE)", "ESP", "-", "-", "-",""],
    ["ESTADOS UNIDOS DE AMERICA(OCDE)", "USA", "-", "V", "V",""],
    ["ESTONIA (OCDE)", "EST", "-", "-", "-",""],
    ["ESWATINI", "SWZ", "V-AVE", "V", "V",""],
    ["ETIOPIA", "ETH", "V-AVE", "V", "V",""],
    ["FEDERACIÓN RUSA", "RUS", "*Ver Obs", "-", "-",""],
    ["FIJI", "FJI", "-", "-", "-",""],
    ["FILIPINAS", "PHL", "V-AVE", "-", "-","INFORMATIVO"],
    ["FINLANDIA (OCDE)", "FIN", "-", "-", "-",""],
    ["FRANCIA (OCDE)", "FRA", "-", "-", "-",""],
    ["GABON", "GAB", "V-AVE", "V", "V",""],
    ["GAMBIA", "GMB", "V-AVE", "V", "V",""],
    ["GEORGIA", "GEO", "*Ver Obs", "-", "-",""],
    ["GHANA", "GHA", "V-AVE", "V", "V",""],
    ["GRANADA (GRENADA)", "GRD", "-", "-", "-",""],
    ["GRECIA (OCDE)", "GRC", "-", "-", "-",""],
    ["GUATEMALA", "GTM", "-", "-", "-",""],
    ["GUINEA", "GIN", "V-AVE", "V", "V",""],
    ["GUINEA-BISSAU", "GNB", "V-AVE", "V", "V",""],
    ["GUINEA ECUATORIAL", "GNQ", "V-AVE", "V", "V",""],
    ["GUYANA", "GUY", "-", "-", "-",""],
    ["HAITÍ", "HTI", "V", "-", "-",""],
    ["HONDURAS", "HND", "-", "-", "-",""],
    ["HONG KONG con Pte. Británico B.N.O.", "GBN", "-", "-", "-",""],
    ["HONG KONG con nuevo Pte. S.A.R.", "HKG", "-", "-", "-",""],
    ["HUNGRÍA (OCDE)", "HUN", "-", "-", "-",""],
    ["INDIA", "IND", "V-AVE/*Ver Obs*", "-", "-","INFORMATIVO"],
    ["INDONESIA", "IDN", "V-AVE/*Ver Obs", "-", "-","CONSULTA"],
    ["INTERPOL", "XPO", "V", "-", "-",""],
    ["IRAK", "IRQ", "V", "V", "V","CONSULTA"],
    ["IRAN", "IRN", "V", "V", "V","CONSULTA"],
    ["IRLANDA (OCDE)", "IRL", "-", "V", "V",""],
    ["ISLANDIA (OCDE)", "ISL", "-", "-", "-",""],
    ["ISRAEL (OCDE)", "ISR", "-", "-", "-",""],
    ["ITALIA (OCDE)", "ITA", "-", "-", "-",""],
    ["JAMAICA", "JAM", "-", "-", "-",""],
    ["JAPÓN (OCDE)", "JPN", "-", "-", "-","CONSULTA"],
    ["JORDANIA", "JOR", "V", "V", "V",""],
    ["KAZAJSTÁN", "KAZ", "*Ver Obs/V", "90 Días", "-",""],
    ["KENYA", "KEN", "V-AVE", "V", "V",""],
    ["KIRGUISTÁN", "KGZ", "V", "V", "V","CONSULTA"],
    ["KIRIBATI", "KIR", "V-AVE", "V", "V",""],
    ["KOSOVO", "XKK", "C/V", "x", "x",""],
    ["KUWAIT", "KWT", "V-AVE", "V", "V","INFORMATIVO"],
    ["LAOS (LAO)", "LAO", "V-AVE", "V", "V",""],
    ["LESOTHO", "LSO", "V-AVE", "V", "V",""],
    ["LETONIA (LATVIA) (OCDE)", "LVA", "-", "-", "-",""],
    ["LÍBANO", "LBN", "V", "V", "V","CONSULTA"],
    ["LIBERIA", "LBR", "V", "V", "V","CONSULTA"],
    ["LIBIA", "LBY", "V", "V", "V","CONSULTA"],
    ["LIECHTENSTEIN", "LIE", "-", "-", "-",""],
    ["LITUANIA", "LTU", "-", "-", "-",""],
    ["LUXEMBURGO (OCDE)", "LUX", "-", "-", "-",""],
    ["MACAO", "MAC", "-", "X","X",""],
    ["MACEDONIA, ex Rep. Yugoslava de", "MKD", "*Ver Obs", "-","-",""],
    ["MADAGASCAR", "MDG", "V-AVE", "V", "V",""],
    ["MALASIA", "MYS", "*OBS","-","-",""],
    ["MALAWI", "MWI", "V-AVE", "V", "V",""],
    ["MALDIVAS", "MDV", "V-AVE", "V", "V",""],
    ["MALÍ", "MLI", "V", "V", "V","CONSULTA"],
    ["MALTA, REPÚBLICA DE", "MLT", "-","-","-",""],
    ["MALTA, Soberana Orden Militar de (Dto. N° 285/98)", "XOM", "x","-","-",""],
    ["MARSHALL, ISLAS", "MHL", "V-AVE", "V", "V",""],
    ["MARRUECOS", "MAR", "V","-","-","INFORMATIVO"],
    ["MAURICIO", "MUS", "V-AVE", "V", "V",""],
    ["MAURITANIA", "MRT", "V", "V", "V","CONSULTA"],
    ["MÉXICO (OCDE)", "MEX", "-","-","-",""],
    ["MICRONESIA, Estados Federados de", "FSM", "V", "V", "V",""],
    ["MOLDOVA", "MDA", "V-AVE", "V", "V",""],
    ["MONACO", "MCO", "-","-","-",""],
    ["MONGOLIA", "MNG", "-", "-", "-",""],
    ["MONTENEGRO", "MNE", "-","-", "-",""],
    ["MOZAMBIQUE", "MOZ", "V-AVE","-","-",""],
    ["MYANMAR (ex BIRMANIA)", "MMR", "V-AVE", "V", "V",""],
    ["NAMIBIA", "NAM", "V-AVE", "V", "V",""],
    ["NAURU", "NRU", "V-AVE", "V", "V",""],
    ["NEPAL", "NPL", "V-AVE", "V", "V",""],
    ["NICARAGUA", "NIC",  "-", "-", "-",""],
    ["NÍGER", "NER",  "V-AVE", "V", "V",""],
    ["NIGERIA", "NGA", "V", "V", "V","CONSULTA"],
    ["NORUEGA (OCDE)", "NOR",  "-", "-", "-",""],
    ["NUEVA ZELANDIA (OCDE)", "NZL", "-", "-", "-",""],
    ["OMAN", "OMN", "V-AVE", "V", "V",""],
    ["PAÍSES BAJOS (OCDE)", "NLD", "-", "-", "-",""],
    ["PAKISTÁN", "PAK", "V", "-", "-","CONSULTA"],
    ["PALAU", "PLW", "V-AVE", "V", "V",""],
    ["PALESTINA", "PSE", "V", "V", "V","CONSULTA"],
    ["PANAMA", "PAN", "-", "-", "-",""],
    ["PAPUA NUEVA GUINEA", "PNG", "V-AVE", "V", "V",""],
    ["PARAGUAY", "PRY", "-", "-", "-",""],
    ["PERU", "PER", "-", "-", "-",""],
    ["POLONIA (OCDE)", "POL", "-", "-", "-",""],
    ["PORTUGAL (OCDE)", "PRT", "-", "-", "-",""],
    ["PUERTO RICO", "PRI", "-", "V", "V",""],
    ["QATAR", "QAT", "-", "-", "-",""],
    ["REINO UNIDO de GRAN BRETAÑA e IRLANDA DEL NORTE (OCDE)", "GBR", "-", "-", "-",""],
    ["REPÚBLICA ÁRABE SAHARAUI DEMOCRÁTICA (ex Sahara Occidental)", "ESH", "C/V","x","x",""],
    ["REPÚBLICA CENTRO AFRICANA", "CAF", "V-AVE", "V", "V",""],
    ["REPÚBLICA CHECA (OCDE)", "CZE", "-","-","-",""],
    ["REPÚBLICA DOMINICANA", "DOM", "V*", "-","-",""],
    ["REPÚBLICA DOMINICANA", "DOM", "*Ver Obs", "-","-",""],
    ["REPÚBLICA ESLOVACA (OCDE)", "SVK", "-","-","-",""],
    ["REPUBLICA MOLDAVA NISTRINA", "x", "-","-","-",""],
    ["RUMANIA", "ROU", "*Ver Obs","-","-",""],
    ["RWANDA / RUANDA", "RWA", "V-AVE", "V", "V",""],  
    ["SALOMON, ISLAS", "SLB", "V-AVE", "V", "V",""],
    ["SAMOA OCCIDENTAL", "WSM", "V-AVE", "V", "V",""],
    ["SAN CRISTÓBAL Y NEVIS", "KNA", "-","-","-",""],
    ["SAN MARINO", "SMR", "-","-","-",""],
    ["SANTA LUCÍA", "LCA", "-","-","-",""],
    ["SANTA SEDE (ver VATICANO)", "VAT","x", "-","-",""],
    ["SANTO TOME Y PRÍNCIPE", "STP", "V-AVE", "V", "V",""],
    ["SAN VICENTE Y LAS GRANADINAS", "VCT", "-","-","-",""],
    ["SENEGAL", "SEN", "V-AVE", "V", "V",""],
    ["SERBIA", "SRB", "-","-","-",""],
    ["SEYCHELLES", "SYC", "V-AVE", "V", "V",""],
    ["SIERRA LEONA", "SLE", "V-AVE", "V", "V",""],
    ["SINGAPUR", "SGP", "-","-","-",""],
    ["SIRIA", "SYR", "V","V","V","CONSULTA"],
    ["SOMALÍA", "SOM", "V", "V", "V","CONSULTA"],
    ["SRI LANKA", "LKA", "V","V","V","CONSULTA"],
    ["SUDÁFRICA, REP. de", "ZAF", "-","-","-",""],
    ["SUDÁN, REPÚBLICA DEL", "SDN", "V", "V", "V","CONSULTA"],
    ["SUDAN DEL SUR (Dto. Nº 1.072/11)", "SSD", "V", "V", "V","CONSULTA"],
    ["SUECIA (OCDE)", "SWE", "-","-","-",""],
    ["SUIZA (OCDE)", "CHE", "-","-","-",""],
    ["SURINAME", "SUR", "-","-","-",""],
    ["SWAZILANDIA (VER ESWATINI) ", "SWZ", "V-AVE", "V", "V",""],
    ["TAILANDIA", "THA", "-","-","-",""],
    ["TAIWÁN", "TWN", "C/V - AVE","x","x",""],
    ["TANZANIA", "TZA", "V-AVE", "V", "V",""],
    ["TAYIKISTÁN", "TJK", "V", "V", "V","CONSULTA"],
    ["TIMOR-LESTE (ex Timor Oriental)", "TLS", "V", "V", "V","CONSULTA"],
    ["TOGO", "TGO", "V-AVE", "V", "V",""],
    ["TONGA", "TON", "V-AVE", "V", "V",""],
    ["TRINIDAD Y TOBAGO", "TTO", "-","-","-",""],
    ["TUNEZ", "TUN", "V", "-","-","INFORMATIVO"],
    ["TURKMENISTÁN", "TKM", "V", "V", "V","CONSULTA"],
    ["TURQUÍA (OCDE)", "TUR", "-","-","-",""],
    ["TUVALU", "TUV", "V-AVE", "V", "V",""],
    ["UCRANIA", "UKR", "*Ver Obs","-","-",""],
    ["UGANDA", "UGA", "V-AVE", "V", "V",""],
    ["URUGUAY", "URY", "-","-","-",""],
    ["UZBEKISTÁN", "UZB", "V", "V", "V","CONSULTA"],
    ["VANUATU", "VUT", "V-AVE", "V", "V",""],
    ["VATICANO (ver SANTA SEDE)", "VAT", "-","x","x",""],
    ["VENEZUELA", "VEN", "-","-","-","VERIFICACION"],
    ["VIETNAM", "VNM", "V-AVE", "-","-",""],
    ["YEMEN", "YEM", "V", "V", "V","CONSULTA"],
    ["ZAMBIA", "ZMB", "V-AVE", "V", "V",""],
    ["ZIMBABWE", "ZWE", "V-AVE", "V", "V",""],
  ];

  const obs = [
  { pais: "AFGANISTÁN", codigo: "AFG", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "ALEMANIA (OCDE)", codigo: "DEU", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días, para actividades no remuneradas o de negocios propios." },
  { pais: "ANTIGUA Y BARBUDA", codigo: "ATG", texto: "Titulares de pasaportes diplomáticos y oficiales exentos de visa hasta 90 días." },
  { pais: "ARABIA SAUDITA", codigo: "SAU", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "ARGELIA", codigo: "DZA", texto: "Pasaportes diplomáticos, oficiales y de servicio exentos de visa hasta 30 días, con consulta al área de seguridad." },
  { pais: "ARMENIA", codigo: "ARM", texto: "Ex república integrante de la URSS, reconocida por Argentina." },
  { pais: "AUSTRALIA (OCDE)", codigo: "AUS", texto: "Sin visación consular para transitorio-negocios-inversiones-estudios de mercado (Res. 1447/98); además exenta por ser miembro OCDE hasta 90 días." },
  { pais: "AUSTRIA (OCDE)", codigo: "AUT", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "AZERBAIYÁN", codigo: "AZE", texto: "Ex república de la URSS reconocida por Argentina; pasaportes diplomáticos/oficiales/servicio exentos hasta 30 días con consulta de seguridad." },
  { pais: "BAHAMAS", codigo: "BHS", texto: "Titulares de pasaportes diplomáticos y oficiales exentos de visa hasta 90 días." },
  { pais: "BANGLADESH", codigo: "BGD", texto: "Requiere visa en todas las categorías con consulta de seguridad; diplomáticos y oficiales exentos hasta 90 días." },
  { pais: "BELARÚS (BIELORRUSIA)", codigo: "BLR", texto: "Ex república de la URSS reconocida por Argentina; pasaportes comunes exentos de visa hasta 90 días por año calendario." },
  { pais: "BÉLGICA (OCDE)", codigo: "BEL", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "BELICE", codigo: "BLZ", texto: "Pasaportes diplomáticos y oficiales exentos de visa hasta 90 días." },
  { pais: "BENIN", codigo: "BEN", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "BOSNIA Y HERZEGOVINA", codigo: "BIH", texto: "Ex república integrante de la Federación Yugoslava." },
  { pais: "BOTSWANA", codigo: "BWA", texto: "Exención de visado según Nota DNERE.PASAP N° 2109-2016." },
  { pais: "BRASIL", codigo: "BRA", texto: "Acuerdo de exención de visado para artistas, profesores, científicos, deportistas, empresarios, periodistas y técnicos especializados, hasta 90 días." },
  { pais: "BULGARIA", codigo: "BGR", texto: "Exención de visado para pasaportes ordinarios, turismo/negocios/deportes/arte/ciencia no remunerados, hasta 90 días en 6 meses." },
  { pais: "BURKINA FASO (ex ALTO VOLTA)", codigo: "BFA", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "CABO VERDE", codigo: "CPV", texto: "Pasaportes diplomáticos y oficiales exentos de visa hasta 90 días." },
  { pais: "CAMERÚN", codigo: "CMR", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "CANADÁ (OCDE)", codigo: "CAN", texto: "Exención de visado para negocios hasta 90 días (prorrogable); además exenta por ser miembro OCDE." },
  { pais: "COLOMBIA (OCDE)", codigo: "COL", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "COMORES, ISLAS", codigo: "COM", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "CONGO, REP. DEMOC. del (ex Zaire)", codigo: "COD", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "CONGO, REP. POPULAR. del", codigo: "COG", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "COREA, REP. de (OCDE)", codigo: "KOR", texto: "Sin visación consular para turistas/hombres de negocios (transitorio, 3 meses prorrogables); además exenta por ser miembro OCDE." },
  { pais: "COREA, REP. DEMOC. Y POP. de", codigo: "PRK", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "COSTA RICA (OCDE)", codigo: "CRI", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "CROACIA", codigo: "HRV", texto: "Ex república integrante de la Federación Yugoslava." },
  { pais: "CHAD", codigo: "TCD", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "CHILE (OCDE)", codigo: "CHL", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "CHINA, REP. POPULAR", codigo: "CHN", texto: "Régimen especial y cambiante: exigencia histórica de visado o AVE; desde jul. 2025 (Res. 316/2025) se autoriza el ingreso sin visado ni AVE a turistas/hombres de negocios que posean visa vigente de EE.UU. (hasta 30 días); también aplica a titulares de Green Card estadounidense. Existen además acuerdos de visas de negocios/turismo de larga validez y reconocimiento de pasaportes de Asuntos Públicos como oficiales." },
  { pais: "CHIPRE", codigo: "CYP", texto: "Pasaportes diplomáticos, oficiales y de servicio exentos de visa hasta 90 días (60 días si están acreditados)." },
  { pais: "DINAMARCA (OCDE)", codigo: "DNK", texto: "Hombres de negocios exentos de visado hasta 3 meses; además exenta por ser miembro OCDE." },
  { pais: "DOMINICA", codigo: "DMA", texto: "Incluida en la nómina de países sin visación de turismo; diplomáticos y oficiales exentos hasta 90 días." },
  { pais: "EGIPTO", codigo: "EGY", texto: "Diplomáticos y oficiales exentos de visa por 15 días con reingresos múltiples, prorrogable." },
  { pais: "EMIRATOS ÁRABES UNIDOS", codigo: "ARE", texto: "Diplomáticos, especiales y oficiales exentos de visa hasta 90 días; pasaportes ordinarios también exentos para turismo/negocios hasta 90 días." },
  { pais: "ERITREA", codigo: "ERI", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "ESLOVENIA (OCDE)", codigo: "SVN", texto: "Ex república de la Federación Yugoslava; exenta por ser miembro OCDE; además cuenta con programa de vacaciones y trabajo (visa de 12 meses)." },
  { pais: "ESPAÑA (OCDE)", codigo: "ESP", texto: "Exenta por ser miembro OCDE; además programa de movilidad de jóvenes con visa transitorio-turista-trabajo de 12 meses." },
  { pais: "ESTADOS UNIDOS DE AMÉRICA (OCDE)", codigo: "USA", texto: "Empresarios/hombres de negocios exentos de visado (2 meses); además exenta por ser miembro OCDE." },
  { pais: "ESTONIA (OCDE)", codigo: "EST", texto: "Ex república de la URSS; exención de visado con Letonia (90 días); además exenta por ser miembro OCDE." },
  { pais: "FEDERACIÓN RUSA", codigo: "RUS", texto: "Ex república de la URSS; exención de visado hasta 90 días dentro de un período de 180 días desde el primer ingreso." },
  { pais: "FIJI", codigo: "FJI", texto: "Pasaportes comunes exentos de visa hasta 90 días; diplomáticos y de servicio también exentos hasta 90 días." },
  { pais: "FILIPINAS", codigo: "PHL", texto: "Diplomáticos y oficiales sin visa si la permanencia no excede 60 días o están en tránsito." },
  { pais: "FINLANDIA (OCDE)", codigo: "FIN", texto: "Hombres de negocios exentos de visado hasta 3 meses; además exenta por ser miembro OCDE." },
  { pais: "FRANCIA (OCDE)", codigo: "FRA", texto: "Acceso sin visa hasta 3 meses con pasaporte diplomático, oficial o común; además exenta por ser miembro OCDE." },
  { pais: "GAMBIA", codigo: "GMB", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "GEORGIA", codigo: "GEO", texto: "Ex república de la URSS; diplomáticos/oficiales/servicio exentos hasta 90 días en 180; pasaportes comunes también exentos hasta 90 días." },
  { pais: "GRANADA (GRENADA)", codigo: "GRD", texto: "No requiere visa en pasaportes comunes hasta 30 días." },
  { pais: "GRECIA (OCDE)", codigo: "GRC", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "GUINEA", codigo: "GIN", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "GUINEA-BISSAU", codigo: "GNB", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "HAITÍ", codigo: "HTI", texto: "Excluida de la nómina de países sin visación de turismo desde 2018: requiere visa." },
  { pais: "HONG KONG con Pte. Británico B.N.O.", codigo: "GBN", texto: "Titulares de pasaporte B.N.O. no requieren visa para turismo, negocios y actividades artísticas hasta 30 días." },
  { pais: "HONG KONG con nuevo Pte. S.A.R.", codigo: "HKG", texto: "Titulares de pasaporte S.A.R. no requieren visa para turismo y negocios hasta 90 días." },
  { pais: "HUNGRÍA (OCDE)", codigo: "HUN", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "INDIA", codigo: "IND", texto: "Visa gratuita para turismo y tránsito, con tratamiento especial para hombres de negocios (visado de 5 años, múltiples ingresos, 90 días por ingreso); desde 2025 (Res. 353/2025) exención sin visado ni AVE con visa vigente de EE.UU. (90 días) y para titulares de Green Card." },
  { pais: "INDONESIA", codigo: "IDN", texto: "Diplomáticos y oficiales o de servicio exentos de visa hasta 30 días." },
  { pais: "INTERPOL", codigo: "XPO", texto: "Reconocimiento de la libreta-pasaporte electrónica de funcionarios; actualmente, ante la suspensión de su emisión, se exige pasaporte ordinario con vigencia mínima de 90 días." },
  { pais: "IRAK", codigo: "IRQ", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "IRAN", codigo: "IRN", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "IRLANDA (OCDE)", codigo: "IRL", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "ISLANDIA (OCDE)", codigo: "ISL", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "ISRAEL (OCDE)", codigo: "ISR", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "ITALIA (OCDE)", codigo: "ITA", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "JAMAICA", codigo: "JAM", texto: "No requiere visa en pasaportes comunes hasta 30 días." },
  { pais: "JAPÓN (OCDE)", codigo: "JPN", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "JORDANIA", codigo: "JOR", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "KAZAJSTÁN", codigo: "KAZ", texto: "Ex república de la URSS; diplomáticos/servicio exentos hasta 90 días; turismo/negocios sin visado hasta 30 días dentro de 1 año, prorrogable una vez." },
  { pais: "KENYA", codigo: "KEN", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "KIRGUISTÁN", codigo: "KGZ", texto: "Ex república de la URSS; requiere visa en todas las categorías con consulta al organismo de seguridad." },
  { pais: "KOSOVO", codigo: "XKK", texto: "Ex república de la Federación Yugoslava; ingresa con Certificado de Viaje (C/V)." },
  { pais: "LETONIA (LATVIA) (OCDE)", codigo: "LVA", texto: "Ex república de la URSS; exención de visado con Estonia (90 días); además exenta por ser miembro OCDE." },
  { pais: "LÍBANO", codigo: "LBN", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "LIBERIA", codigo: "LBR", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "LIBIA", codigo: "LBY", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "LITUANIA (OCDE)", codigo: "LTU", texto: "Ex república de la URSS; exención de visado para turismo/negocios/deportes/arte/ciencia no remunerados, 90 días; además exenta por ser miembro OCDE." },
  { pais: "LUXEMBURGO (OCDE)", codigo: "LUX", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "MACAO", codigo: "MAC", texto: "Exención de visado para turismo o negocios, 30 días, entre Argentina y la Región Administrativa Especial de Macao." },
  { pais: "MACEDONIA, ex Rep. Yugoslava de", codigo: "MKD", texto: "Ex república de la Federación Yugoslava; exención de visado turismo 90 días; diplomáticos y oficiales también exentos 90 días." },
  { pais: "MALASIA", codigo: "MYS", texto: "No requiere visa en pasaportes diplomáticos, oficiales y de servicio hasta 3 meses; comunes por turismo 30 días y hasta 90 días para negocios/inversiones/conferencias/deportes." },
  { pais: "MALÍ", codigo: "MLI", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "MARRUECOS", codigo: "MAR", texto: "Visa gratuita en pasaportes comunes para turismo, tránsito y negocios; requiere visa en todas las categorías con consulta de seguridad." },
  { pais: "MAURITANIA", codigo: "MRT", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "MÉXICO (OCDE)", codigo: "MEX", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "MOLDOVA", codigo: "MDA", texto: "Ex república de la URSS reconocida por Argentina." },
  { pais: "MONGOLIA", codigo: "MNG", texto: "Pasaportes diplomáticos, oficiales o comunes exentos de visa hasta 90 días, sin actividad remunerada." },
  { pais: "MONTENEGRO", codigo: "MNE", texto: "Ex república de la Federación Yugoslava; pasaporte ordinario admitido como transitorio sin visación; diplomáticos y oficiales exentos hasta 90 días (60 si acreditados)." },
  { pais: "MOZAMBIQUE", codigo: "MOZ", texto: "Requiere visa en todas las categorías (salvo diplomáticos/oficiales, exentos hasta 90 días)." },
  { pais: "NAURU", codigo: "NRU", texto: "Tras el reconocimiento de Argentina, se suprimió el certificado de viaje; ahora requiere visado en el pasaporte." },
  { pais: "NÍGER", codigo: "NER", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "NIGERIA", codigo: "NGA", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "NORUEGA (OCDE)", codigo: "NOR", texto: "Hombres de negocios exentos de visado hasta 3 meses; además exenta por ser miembro OCDE." },
  { pais: "NUEVA ZELANDIA (OCDE)", codigo: "NZL", texto: "Sin visación consular para transitorio-turista-negocios-inversiones-estudios de mercado; programa de vacaciones y trabajo; además exenta por ser miembro OCDE." },
  { pais: "PAÍSES BAJOS (OCDE)", codigo: "NLD", texto: "Sin visación consular para transitorio-negocios-inversiones-estudios de mercado, y hasta 3 meses para actividades no remuneradas; además exenta por ser miembro OCDE." },
  { pais: "PAKISTÁN", codigo: "PAK", texto: "Diplomáticos, oficiales y de servicio no requieren visa hasta 3 meses, con consulta al área de seguridad." },
  { pais: "PALESTINA", codigo: "PSE", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "POLONIA (OCDE)", codigo: "POL", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "PORTUGAL (OCDE)", codigo: "PRT", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "QATAR", codigo: "QAT", texto: "Pasaportes ordinarios exentos de visa para turismo/negocios hasta 90 días; diplomáticos, oficiales y especiales también exentos 90 días." },
  { pais: "REINO UNIDO de GRAN BRETAÑA e IRLANDA DEL NORTE (OCDE)", codigo: "GBR", texto: "Empresarios/hombres de negocios exentos de visado (2 meses, excepto documentación de Hong Kong); además exenta por ser miembro OCDE." },
  { pais: "REPÚBLICA ÁRABE SAHARAUI DEMOCRÁTICA (ex Sahara Occidental)", codigo: "ESH", texto: "Ingresa con Certificado de Viaje (C/V)." },
  { pais: "REPÚBLICA CENTRO AFRICANA", codigo: "CAF", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "REPÚBLICA CHECA (OCDE)", codigo: "CZE", texto: "Hombres de negocios exentos del requisito de visado; además exenta por ser miembro OCDE." },
  { pais: "REPÚBLICA DOMINICANA", codigo: "DOM", texto: "Desde jul. 2025 (Res. 316/2025), exención sin visado ni AVE con visa vigente de EE.UU. (90 días, carácter transitorio); también aplica a titulares de Green Card." },
  { pais: "REPÚBLICA ESLOVACA (OCDE)", codigo: "SVK", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "REPÚBLICA MOLDAVA NISTRINA", codigo: "", texto: "Argentina no reconoce a esta entidad ni acepta el 'Pasaporte Transnitrino' emitido por ella como documento oficial." },
  { pais: "RUMANIA", codigo: "ROU", texto: "Exención de visado para turismo y negocios, hasta 90 días dentro de 6 meses." },
  { pais: "RWANDA / RUANDA", codigo: "RWA", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "SAN CRISTÓBAL Y NEVIS", codigo: "KNA", texto: "Exención de visado para turismo, negocios, deportes, arte y actividades técnicas, remuneradas o no, hasta 90 días." },
  { pais: "SANTA LUCÍA", codigo: "LCA", texto: "Exención de visado para turismo o negocios, hasta 90 días corridos, prorrogable." },
  { pais: "SANTA SEDE (ver VATICANO)", codigo: "VAT", texto: "Exención de visado consular para ingreso transitorio no remunerado, hasta 90 días." },
  { pais: "SENEGAL", codigo: "SEN", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "SERBIA", codigo: "SRB", texto: "Ex república integrante de la Federación Yugoslava." },
  { pais: "SINGAPUR", codigo: "SGP", texto: "Sin visado consular para turismo o negocios, hasta 90 días." },
  { pais: "SIRIA", codigo: "SYR", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "SOMALÍA", codigo: "SOM", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "SRI LANKA", codigo: "LKA", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "SUDÁFRICA, REP. de", codigo: "ZAF", texto: "Sin visación consular para residentes transitorios-turistas-negocios-inversiones; exención adicional no remunerada hasta 90 días." },
  { pais: "SUDÁN, REPÚBLICA DEL", codigo: "SDN", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "SUDÁN DEL SUR", codigo: "SSD", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "SUECIA (OCDE)", codigo: "SWE", texto: "Hombres de negocios exentos de visado hasta 3 meses; además exenta por ser miembro OCDE." },
  { pais: "SUIZA (OCDE)", codigo: "CHE", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "SURINAME", codigo: "SUR", texto: "Exención de visado para pasaportes ordinarios (90 días) y diplomáticos/oficiales/servicio (90 días)." },
  { pais: "TAILANDIA", codigo: "THA", texto: "Exención de visado para turismo o negocios, sin actividad remunerada, hasta 90 días." },
  { pais: "TAIWÁN", codigo: "TWN", texto: "Ingresa con Certificado de Viaje (C/V) o Autorización de Viaje Electrónica (AVE)." },
  { pais: "TAYIKISTÁN", codigo: "TJK", texto: "Ex república de la URSS; requiere visa en todas las categorías con consulta al organismo de seguridad." },
  { pais: "TIMOR-LESTE (ex Timor Oriental)", codigo: "TLS", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "TOGO", codigo: "TGO", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  { pais: "TONGA", codigo: "TON", texto: "Tras el reconocimiento de Argentina, se suprimió el certificado de viaje; ahora requiere visado en el pasaporte." },
  { pais: "TRINIDAD Y TOBAGO", codigo: "TTO", texto: "Exención de visado en pasaportes comunes para turistas y hombres de negocios." },
  { pais: "TURKMENISTÁN", codigo: "TKM", texto: "Ex república de la URSS; requiere visa en todas las categorías con consulta al organismo de seguridad." },
  { pais: "TURQUÍA (OCDE)", codigo: "TUR", texto: "Exenta de visado consular por ser miembro OCDE, hasta 90 días." },
  { pais: "TUVALU", codigo: "TUV", texto: "Tras el reconocimiento de Argentina, se suprimió el certificado de viaje; ahora requiere visado en el pasaporte." },
  { pais: "UCRANIA", codigo: "UKR", texto: "Ex república de la URSS; exención de visado hasta 90 días dentro de un período de 180 días desde el primer ingreso." },
  { pais: "URUGUAY", codigo: "URY", texto: "Exención de visado consular en el marco del MERCOSUR, hasta 90 días, prorrogable una vez." },
  { pais: "UZBEKISTÁN", codigo: "UZB", texto: "Ex república de la URSS; requiere visa en todas las categorías con consulta al organismo de seguridad." },
  { pais: "VATICANO (ver SANTA SEDE)", codigo: "VAT", texto: "Exención de visado consular para ingreso transitorio no remunerado, hasta 90 días." },
  { pais: "VENEZUELA", codigo: "VEN", texto: "Acuerdo de supresión de visado en pasaportes diplomáticos/oficiales/de servicio, suspendido en 2019 y reanudado desde enero de 2023." },
  { pais: "YEMEN", codigo: "YEM", texto: "Requiere visa en todas las categorías migratorias, con consulta consular previa al organismo de seguridad competente." },
  ];

  // Datos que se piden a la planilla de países sensibles
  const datosPlanilla = [
    "Destino (hotel o dirección).",
    "Permanencia (tiempo de estadía).",
    "Correo electrónico.",
    "Teléfono.",
    "Motivo del viaje."
  ];

  // Procedimientos vigentes. Cada uno se dispara por:
  //  - codigo: lista de códigos de país (columna 2 de `visas`), o
  //  - sensibilidad: valor de la última columna de `visas` (CONSULTA / INFORMATIVO / VERIFICACION).
  // Los que se disparan por sensibilidad se muestran desplegados automáticamente.
  const procedimientos = [
    {
      id: "sensible-verificacion",
      titulo: "País sensible: Verificación",
      sensibilidad: "VERIFICACION",
      pasos: [
        "Aplica únicamente a mayores con pasaporte de su nacionalidad.",
        "Residentes de países del MERCOSUR no necesitan información adicional.",
        { texto: "En casos de alertas o inconsistencias en los motivos de ingreso, verificar antecedentes con el DIAC y aguardar la devolución. Datos a informar:", items: datosPlanilla }
      ]
    },
    {
      id: "sensible-consulta",
      titulo: "País sensible: Consulta DIAC",
      sensibilidad: "CONSULTA",
      pasos: [
        { texto: "Generar un incidente para intervención del DIAC con la planilla completa, con la siguiente información:", items: datosPlanilla },
        "Aguardar la respuesta del DIAC para verificar la existencia de antecedentes o información de interés.",
        "Derivar al supervisor la documentación sin liberar al pasajero."
      ]
    },
    {
      id: "sensible-informativo",
      titulo: "País sensible: Informativo",
      sensibilidad: "INFORMATIVO",
      pasos: [
        { texto: "Enviar la planilla con carácter informativo, con la siguiente información:", items: datosPlanilla },
        "No es necesario aguardar respuesta del DIAC para continuar con el trámite."
      ]
    },
    {
      id: "visado-estadounidense",
      titulo: "Visado estadounidense",
      codigo: ["CHN", "IND", "DOM"],
      pasos: [
        "Verificar el tipo de visa ( B1 / B2 / J / O / P (P1-P2-P3) / E / H-1B) y la vigencia.",
        "Verificar validez en Intranet (issuing (ciudad donde se emitió), surname (apellido), given name (nombre), birth date (fecha de nacimiento)).",
        "Si es válida, escanear la visa.",
        'Ingresar en "Actuaciones y Visas" y cargar los datos de la categoría y los días correspondientes a la nacionalidad.'
      ]
    },
    {
      id: "greencard",
      titulo: "Greencard MEMO 05575830/2026",
      codigo: ["CHN", "IND", "DOM"],
      pasos: [
        "Verificar la autenticidad y vigencia de la documentación.",
        "Si es válida, escanear la credencial.",
        'Ingresar en "Actuaciones y Visas" y cargar los datos de la categoría y los días correspondientes a la nacionalidad.'
      ]
    },
    {
      id: "antecedentes-colombianos",
      titulo: "Antecedentes colombianos",
      codigo: ["COL"],
      pasos: [
        "Verificar en las plataformas habilitadas por las autoridades colombianas.",
        "Si no presenta irregularidades, liberar al pasajero."
      ]
    }
  ];

  // ¿Este procedimiento aplica a este país? (visa = fila del array `visas`)
  const procedimientoAplica = (proc, visa) => {
    const codigoPais = visa[1];
    const sensibilidad = visa[5];
    if (proc.codigo && proc.codigo.includes(codigoPais)) return true;
    if (proc.sensibilidad && proc.sensibilidad === sensibilidad) return true;
    return false;
  };

  // Recorre los países encontrados y devuelve los procedimientos que aplican,
  // agrupados por procedimiento (sin repetir) junto con los países a los que aplica.
  const obtenerProcedimientos = (paises) =>
    procedimientos
      .map((proc) => ({
        proc,
        paises: [...new Set(paises.filter((visa) => procedimientoAplica(proc, visa)).map((visa) => visa[0]))]
      }))
      .filter((item) => item.paises.length > 0);

  // Los de países sensibles arrancan abiertos; el resto, cerrados
  const estaAbierto = (proc) => abiertos[proc.id] ?? Boolean(proc.sensibilidad);

  const alternarProcedimiento = (proc) => {
    setAbiertos((prev) => ({ ...prev, [proc.id]: !(prev[proc.id] ?? Boolean(proc.sensibilidad)) }));
  };

  const handleSearch = (e) => {
    const texto = e.target.value;
    const value = normalizar(texto);
    setSearch(texto);
    setAbiertos({});

    if (value.length >= 3) {
      const filtered = visas.filter((visa) =>
        visa.some((itemValue) => normalizar(itemValue).includes(value))
      );
      setResults(filtered);

      const obsFiltradas = obs.filter((o) =>
        normalizar(o.pais).includes(value) ||
        normalizar(o.codigo).includes(value)
      );
      setFilteredObs(obsFiltradas);

      setProcedimientosAplicables(obtenerProcedimientos(filtered));
    } else {
      setResults([]);
      setFilteredObs([]);
      setProcedimientosAplicables([]);
    }
  };

  const renderTextoConTooltip = (texto, palabraClave, aclaracion) => {
    if (!palabraClave || !texto.includes(palabraClave)) return texto;

    const partes = texto.split(new RegExp(`(${palabraClave})`, 'gi'));

    return partes.map((parte, index) => {
      const esClave = parte.toLowerCase() === palabraClave.toLowerCase();
      return esClave ? (
        <span key={index} className="tooltip-container">
          {parte}
          <span className="tooltip-modal">{aclaracion}</span>
        </span>
      ) : (
        <span key={index}>{parte}</span>
      );
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
    <style>{`
      .tooltip-container {
          position: relative;
          display: inline-block;
          cursor: help;
          color: #0077cc;
          font-weight: bold;
        }
        .tooltip-modal {
          position: absolute;
          top: 100%;
          left: 0;
          background: #dbeafe;
          border-left: 4px solid #2563eb;
          border: 1px solid #ccc;
          padding: 8px;
          border-radius: 4px;
          width: 300px;
          white-space: normal;
          overflow-wrap: break-word;
          z-index: 10;
          display: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .tooltip-container:hover .tooltip-modal {
          display: block;
        }
      `}</style>
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
              <th className="text-left">País</th>
              <th className="text-left">Código</th>
              <th className="text-left">Turista</th>
              <th className="text-left">Diplomático</th>
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
        <li key={index}>
          {o.pais}: {renderTextoConTooltip(o.texto, o.textoaaclarar, o.aclaracion)}
        </li>
      ))}
    </ul>
  </div>
)}
      {procedimientosAplicables.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold">Procedimientos vigentes</h4>
          <div className="mt-2 space-y-2">
            {procedimientosAplicables.map(({ proc, paises }) => {
              const abierto = estaAbierto(proc);
              return (
                <div key={proc.id} className="border rounded-lg">
                  <button
                    onClick={() => alternarProcedimiento(proc)}
                    aria-expanded={abierto}
                    className="w-full text-left p-3 rounded-lg hover:bg-purple-100 transition flex justify-between items-center gap-3"
                  >
                    <span>
                      <span className="block font-medium">{proc.titulo}</span>
                      <span className="block text-xs text-gray-500">Aplica a: {paises.join(', ')}</span>
                    </span>
                    <span className="text-gray-500">{abierto ? '▲' : '▼'}</span>
                  </button>
                  {abierto && (
                    <div className="p-4 border-t bg-gray-50">
                      <ol className="list-decimal ml-5 space-y-2">
                        {proc.pasos.map((paso, i) => (
                          <li key={i}>
                            {typeof paso === 'string' ? paso : (
                              <>
                                {paso.texto}
                                <ul className="list-disc ml-5 mt-1">
                                  {paso.items.map((item, j) => (
                                    <li key={j}>{item}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ConsultarFuenteButton url={"https://dirnacmigraciones-my.sharepoint.com/:b:/g/personal/aepavon_migraciones_gob_ar/IQAA5g18fdkXT5W_ygc5Pfd9AaNq0ursKcM258WqK2ChecA?e=XwvHHH"} />
    </div>
  );
};

const Agreements = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  // Array de ejemplo para convenios
  const convenios = [
    {
      name: "Tratado de Facilitación Turística",
      documentCountry: ["BRASIL"],
      beneficiaryCountry: [""],
      detail: "“Acuerdo Sobre Facilitación Turística entre la República Argentina y la República Federativa del Brasil” suscripto en Brasilia el 18/11/09, que entró en vigor el 18/12/09. Serán beneficiarios del presente Acuerdo, los nacionales y los residentes permanentes y temporarios de las Partes que crucen la frontera que vincula directamente a ambos países por el Puente Internacional Tancredo Neves. Podrán transitar dentro de los límites del área geográfica denominada -Corredor Turístico Iguazú- por el plazo de hasta SETENTA Y DOS (72) horas.",
      info: ["CAT: TFT","PERM: 3 DÍAS"],
    },
    {
      name: "Argentina - Chile",
      documentCountry: ["Chile"],
      beneficiaryCountry: [""],
      detail: "-Convenio de Tránsito de Pasajeros- del 30/10/47, modificado en Buenos Aires el 02/08/91, que entró en vigor el 30/09/93 y vuelto a modificar en marzo de 2012. En virtud de dicho acuerdo, los residentes permanentes en uno y otro país podrán ingresar al otro con la sola presentación del documento de identidad adquirido por tal condición, aun cuando por su nacionalidad necesitarán visa consular. Es decir que un extranjero de un tercer país que requiera visa por su nacionalidad en argentina, si es residente permanente en chile podrá ingresar con su cédula de identidad de residente permanente. Y a condición de reciprocidad los residentes en argentina con DNI.",
      info: ["RTU","PERM: 90 DÍAS"],
    },
    {
      name: "San Borja",
      documentCountry: ["Brasil"],
      beneficiaryCountry: ["Brasil"],
      detail: "DIGAC-VISAS Nº 1313/2000 del 24/03/2000). Acuerdo entre la República Argentina y el Gobierno de la República Federativa del Brasil sobre Exención de Visados, suscripto en SAO BORJA el 9 de diciembre de 1997, que entró en vigor el 22/04/2000. El presente acuerdo se aplica a las personas pertenecientes a las siguientes categorías: artistas, profesores, científicos, deportistas, empresarios u hombres de negocios, periodistas, profesionales y técnicos especializados. Se entiende por técnicos especializados a los trabajadores con capacitación otorgada a nivel secundario, terciario no universitario o por una entidad de capacitación laboral. Los nacionales de cualquiera de las Partes, mencionados en el Artículo 1 del presente Acuerdo y a fin de desarrollar las actividades de las categorías respectivas, remuneradas o no, tendrán acceso sin visa al territorio de la otra Parte, para estadías inferiores o iguales a NOVENTA (90) días, prorrogable por igual período, con la sola presentación de un documento identificatorio o de viaje válido en el país de origen",
      info: ["CAT: TRANSITORIA - ESPECIALES A JUICIO DE LA DNM","PERM: 90 DÍAS"],
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
                <th className="p-2 border-b font-medium">Países Beneficiados</th>
                <th className="p-2 border-b font-medium">Detalle</th>
                <th className="p-2 border-b font-medium">Información</th>
              </tr>
            </thead>
            <tbody>
              {results.map((convenio, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{convenio.name}</td>
                  <td className="p-2 border-b">{convenio.documentCountry.join(', ')}</td>
                  <td className="p-2 border-b">{convenio.beneficiaryCountry.join(', ')}</td>
                  <td className="p-2 border-b">{convenio.detail}</td>                  
                  <td className="p-2 border-b">
                    <ul className="list-disc pl-4">
                      {convenio.info.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </td>
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
    ["CHILE", "CHL", "SÍ" ,"RTU 90","RTU 90","AR"],
    ["COLOMBIA", "COL", "SÍ" ,"RTU 90","RTU 90","AR"],
    ["ECUADOR", "ECU", "SÍ" ,"RTU 90","RTU 90","AR"],
    ["ESPAÑA", "ESP", "SÍ" ,"-","RTU 90","-"],
    ["ITALIA", "ITA", "SÍ" ,"-","RTU 90","-"],
    ["NORUEGA", "NOR", "SÍ" ,"-","RTU 90","-"],
    ["SUECIA", "SWE", "SÍ" ,"-","RTU 90","-"],
    ["PANAMA", "PAN", "SÍ" ,"-","RTU 90","-"],
    ["EL SALVADOR", "SLV", "SÍ" ,"-","RTU 90","-"],
    ["HONDURAS", "HND", "SÍ" ,"-","RTU 90","-"],
    ["NICARAGUA", "NIC", "SÍ" ,"-","RTU 90","-"],
    ["ESTADOS UNIDOS", "USA", "SÍ (Antes del '81)" ,"-","RTU 90","-"],
    ["ESTADOS UNIDOS", "USA", "No (Después del '81)" ,"-","ARE 180","-"],
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
          placeholder="Buscar país emisor del documento..."
          className="w-full p-2 border rounded"
        />
      </div>
      {results.length > 0 && (
        <table className="w-full mt-2">
          <thead>
            <tr>
              <th className="text-left">País</th>
              <th className="text-left">Código</th>
              <th className="text-left">¿Convenio?</th>
              <th className="text-left">Cédula de Identidad</th>
              <th className="text-left">Pasaporte</th>
              <th className="text-left">Cédula de Residente</th>
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
    target="_blank"
    rel="noopener noreferrer"
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
            <OutputCard title="Consulta de antecedentes Policía - Colombia" url="https://antecedentes.policia.gov.co:7005/WebJudicial/index.xhtml" />
            <OutputCard title="Generación de antecedentes Procuraduría - Colombia" url="https://www.procuraduria.gov.co/pages/generacion-de-antecedentes.aspx" />
            <OutputCard title="Consulta de expedientes Judiciales - Colombia" url="https://procesos.ramajudicial.gov.co/jepms/bogotajepms/conectar.asp" />
            <OutputCard title="Consulta de expedientes judiciales - Colombia" url="https://consultaprocesos.ramajudicial.gov.co/procesos/NombreRazonSocial" />
  
          </div>   
  
        <div>
          <h2 className="text-2xl font-semibold mb-4 mt-4">Salida</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <OutputCard title="Validación de Documentos Provincia de San Juan" url="https://validacion.sanjuan.gob.ar/" />
            <OutputCard title="Partida de Nacimiento Provincia de Buenos Aires" url="https://www.gdeba.gba.gob.ar/consultagedo/" />
            <OutputCard title="Portal de Autenticidad Ciudad de Buenos Aires" url="https://buenosaires.gob.ar/inicio/portal-autenticidad" />
            <OutputCard title="Verificación de Apostilla o Legalización" url="https://www.argentina.gob.ar/relacionesexterioresyculto/legalizacion-internacional" />
            <OutputCard title="Validador de actas Santiago del Estero" url="https://validaciones.sde.gob.ar/" />
            <OutputCard title="Validador de Datos de Partidas On-line Misiones" url="https://www.registrocivil.misiones.gov.ar/index.php/gestion/verificacion" />
            <OutputCard title="Consultar Último Ejemplar DNI" url="https://tramites.renaper.gob.ar/mi_ejemplar/" />
            <OutputCard title="Plantillas para Incidentes" url="https://dirnacmigraciones-my.sharepoint.com/:x:/g/personal/aepavon_migraciones_gob_ar/EfkhA4-i615IhMTfJ11ZEDYBmNtOsCqT__BJqJJTkhDrUg?e=oD9grn" />
            
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
