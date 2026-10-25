const SENALES_DATA = [
    {
        "id":  "reg_1",
        "name":  "Prohibición de circular autos",
        "category":  "reglamentarias",
        "image":  "img/senales/Prohibiciòn de circular autos-BUXGb_CE.png",
        "description":  "Prohíbe la circulación de vehículos automotores."
    },
    {
        "id":  "reg_2",
        "name":  "Prohibición de circular motos",
        "category":  "reglamentarias",
        "image":  "img/senales/Prohibiciòn de circular motos-_okAS-qM.png",
        "description":  "Prohíbe la circulación de motovehículos."
    },
    {
        "id":  "reg_3",
        "name":  "Prohibido adelantar",
        "category":  "reglamentarias",
        "image":  "img/senales/Prohibido adelantar-5GQZmguS.png",
        "description":  "Prohíbe realizar maniobras de sobrepaso."
    },
    {
        "id":  "reg_4",
        "name":  "Prohibido estacionar",
        "category":  "reglamentarias",
        "image":  "img/senales/Prohibido estacionar-DYZaAM8d.png",
        "description":  "Prohíbe el estacionamiento en el sector indicado."
    },
    {
        "id":  "reg_5",
        "name":  "Prohibido estacionar y detenerse",
        "category":  "reglamentarias",
        "image":  "img/senales/Prohibido estacionar y detenerse-BgIhFWBE.png",
        "description":  "Prohíbe tanto el estacionamiento como la detención momentánea."
    },
    {
        "id":  "reg_6",
        "name":  "Prohibido girar a la izquierda",
        "category":  "reglamentarias",
        "image":  "img/senales/Prohibido girar a la izquierda-wR5olTOd.png",
        "description":  "Prohíbe realizar giros hacia la izquierda."
    },
    {
        "id":  "reg_7",
        "name":  "Prohibido girar en U",
        "category":  "reglamentarias",
        "image":  "img/senales/Prohibido girar en U-VraWjoJX.png",
        "description":  "Prohíbe realizar giros de 180 grados."
    },
    {
        "id":  "reg_8",
        "name":  "Límite de velocidad máxima",
        "category":  "reglamentarias",
        "image":  "img/senales/Lìmite de velocidad màxima-Ihdny6jW.png",
        "description":  "Indica la velocidad máxima permitida en la vía."
    },
    {
        "id":  "reg_9",
        "name":  "Límite de velocidad mínima",
        "category":  "reglamentarias",
        "image":  "img/senales/Lìmite de velocidad minima-BcpJ5gVu.png",
        "description":  "Indica la velocidad mínima obligatoria para circular."
    },
    {
        "id":  "reg_10",
        "name":  "Limitación de altura",
        "category":  "reglamentarias",
        "image":  "img/senales/Limitaciòn de altura-D_z9hmj6.png",
        "description":  "Restricción de paso para vehículos que superen la altura indicada."
    },
    {
        "id":  "reg_11",
        "name":  "Limitación de peso",
        "category":  "reglamentarias",
        "image":  "img/senales/Limitaciòn de peso-CXlT63fw.png",
        "description":  "Restricción de paso para vehículos que superen el peso indicado."
    },
    {
        "id":  "reg_12",
        "name":  "Contramano",
        "category":  "reglamentarias",
        "image":  "img/senales/Contramano-DIXpxLEm.png",
        "description":  "Indica sentido contrario de circulación."
    },
    {
        "id":  "prev_1",
        "name":  "Badén",
        "category":  "preventivas",
        "image":  "img/senales/Badèn-jxmBujiZ.png",
        "description":  "Advierte sobre la proximidad de una depresión transversal en la calzada."
    },
    {
        "id":  "prev_2",
        "name":  "Calzada resbaladiza",
        "category":  "preventivas",
        "image":  "img/senales/Calzada resbaladiza-DkPmgZ9p.png",
        "description":  "Advierte que la calzada puede perder adherencia."
    },
    {
        "id":  "prev_3",
        "name":  "Camino sinuoso",
        "category":  "preventivas",
        "image":  "img/senales/Camino sinuoso-BwfWP0W1.png",
        "description":  "Advierte sobre una sucesión de curvas próximas."
    },
    {
        "id":  "prev_5",
        "name":  "Curva común",
        "category":  "preventivas",
        "image":  "img/senales/Curva comùn-BJ4SncNt.png",
        "description":  "Advierte sobre una curva en la vía."
    },
    {
        "id":  "prev_7",
        "name":  "Estrechamiento en una sola mano",
        "category":  "preventivas",
        "image":  "img/senales/Estrechamiento en una sola mano-BwphcP3R.png",
        "description":  "Advierte una reducción en el ancho de la calzada de un solo lado."
    },
    {
        "id":  "prev_8",
        "name":  "Incorporación de tránsito lateral",
        "category":  "preventivas",
        "image":  "img/senales/Incorporaciòn de trànsito lateral-BWr2xBJ3.png",
        "description":  "Advierte sobre el ingreso de vehículos desde una vía lateral."
    },
    {
        "id":  "prev_9",
        "name":  "Pendiente ascendente",
        "category":  "preventivas",
        "image":  "img/senales/senalg_Iq.jpg",
        "description":  "Advierte sobre una cuesta o subida pronunciada."
    },
    {
        "id":  "prev_10",
        "name":  "Puente angosto",
        "category":  "preventivas",
        "image":  "img/senales/Puente angosto-0b6NIfJd.png",
        "description":  "Advierte sobre un puente con ancho reducido respecto a la calzada."
    },
    {
        "id":  "prev_11",
        "name":  "Túnel",
        "category":  "preventivas",
        "image":  "img/senales/Tùnel-BdPLgJMF.png",
        "description":  "Advierte sobre la proximidad de un túnel."
    },
    {
        "id":  "prev_12",
        "name":  "Zona de derrumbes",
        "category":  "preventivas",
        "image":  "img/senales/Zona de derrumbes-DMFvqksm.png",
        "description":  "Advierte sobre el riesgo de caída de piedras u otros materiales."
    },
    {
        "id":  "prev_13",
        "name":  "Zona escolares",
        "category":  "preventivas",
        "image":  "img/senales/Zona escolares-BVj_v7gh.png",
        "description":  "Advierte sobre la posible presencia de escolares en la zona."
    },
    {
        "id":  "prev_14",
        "name":  "Ciclista",
        "category":  "preventivas",
        "image":  "img/senales/Ciclista-MyoGuhbc.jpg",
        "description":  "Advierte sobre la posible presencia de ciclistas en la vía."
    },
    {
        "id":  "info_1",
        "name":  "Aeródromo",
        "category":  "informativas",
        "image":  "img/senales/Aeròdromo-D0NCwVxU.png",
        "description":  "Indica la ubicación de un aeropuerto o aeródromo."
    },
    {
        "id":  "info_2",
        "name":  "Estación de servicio",
        "category":  "informativas",
        "image":  "img/senales/Estaciòn de servicio-D_JQo82x.png",
        "description":  "Indica la ubicación de una estación de carga de combustible."
    },
    {
        "id":  "info_3",
        "name":  "Gomería",
        "category":  "informativas",
        "image":  "img/senales/Gomerìa-CHqLuJu8.png",
        "description":  "Indica la ubicación de un taller de reparación de neumáticos."
    },
    {
        "id":  "info_4",
        "name":  "Policía",
        "category":  "informativas",
        "image":  "img/senales/Policìa-BeaPsXac.png",
        "description":  "Indica la proximidad de una comisaría o puesto policial."
    },
    {
        "id":  "info_5",
        "name":  "Puesto sanitario",
        "category":  "informativas",
        "image":  "img/senales/Puesto sanitario-7zeG4TqU.png",
        "description":  "Indica la ubicación de un centro de salud o primeros auxilios."
    },
    {
        "id":  "info_6",
        "name":  "Restaurante",
        "category":  "informativas",
        "image":  "img/senales/Restaurante-DuS3tIK6.png",
        "description":  "Indica la ubicación de un establecimiento de comida."
    },
    {
        "id":  "info_7",
        "name":  "Comienzo de autopista",
        "category":  "informativas",
        "image":  "img/senales/Comienzo de autopista-C7zm_IQw.png",
        "description":  "Indica el inicio de una vía con características de autopista."
    },
    {
        "id":  "info_8",
        "name":  "Fin de autopista",
        "category":  "informativas",
        "image":  "img/senales/Fin de autopista-ByM-4O3a.png",
        "description":  "Indica el término de la autopista y retorno a vía común."
    },
    {
        "id":  "info_9",
        "name":  "Esquema de recorrido",
        "category":  "informativas",
        "image":  "img/senales/Esquema de recorrido-Dln6UQ78.png",
        "description":  "Muestra un diagrama del recorrido o intersecciones próximas."
    },
    {
        "id":  "info_10",
        "name":  "Orientación",
        "category":  "informativas",
        "image":  "img/senales/Orientaciòn - En caminos primarios y secundarios-Bzc0Dexv.png",
        "description":  "Indica destinos y distancias en caminos primarios o secundarios."
    },
    {
        "id":  "info_11",
        "name":  "Indicadora de utilización de carriles",
        "category":  "informativas",
        "image":  "img/senales/Indicadora de utilizaciòn de carriles-DZsPwDu3.png",
        "description":  "Informa sobre el uso permitido de cada carril."
    },
    {
        "id":  "info_12",
        "name":  "Desvío por cambio de sentido",
        "category":  "informativas",
        "image":  "img/senales/Desvìo por cambio de sentido de circulaciòn-DhdnhThe.png",
        "description":  "Indica un cambio de trayectoria o desvío en el recorrido."
    },
    {
        "id":  "tran_1",
        "name":  "Banderillero",
        "category":  "transitorias",
        "image":  "img/senales/Banderillero-DcXCvhmd.png",
        "description":  "Indica presencia de personal regulando el tránsito por obras."
    },
    {
        "id":  "tran_2",
        "name":  "Conos",
        "category":  "transitorias",
        "image":  "img/senales/senalg_Yq.png",
        "description":  "Elementos de canalización temporal del tránsito."
    },
    {
        "id":  "tran_3",
        "name":  "Delineadores",
        "category":  "transitorias",
        "image":  "img/senales/senalg_Wq.png",
        "description":  "Señalización vertical temporal para guiar el flujo vehicular."
    },
    {
        "id":  "tran_5",
        "name":  "Equipo pesado en la vía",
        "category":  "transitorias",
        "image":  "img/senales/Equipo pesado en la vìa-DJnRkdnH.png",
        "description":  "Advierte sobre maquinaria de gran porte operando."
    },
    {
        "id":  "tran_6",
        "name":  "Fin de construcción",
        "category":  "transitorias",
        "image":  "img/senales/Fin de construcciòn-CTqAs9WR.png",
        "description":  "Indica el término de la zona de obras."
    },
    {
        "id":  "tran_7",
        "name":  "Hombres trabajando",
        "category":  "transitorias",
        "image":  "img/senales/Hombres trabajando-CtKlKFKG.png",
        "description":  "Presencia de obreros en la zona de camino."
    },
    {
        "id":  "tran_8",
        "name":  "Longitud en la construcción",
        "category":  "transitorias",
        "image":  "img/senales/Longitud en la construcciòn-BO0K8AsS.png",
        "description":  "Indica la extensión total del tramo en obra."
    },
    {
        "id":  "tran_9",
        "name":  "Muro Jersey",
        "category":  "transitorias",
        "image":  "img/senales/Muro Jersey-CECut4CH.png",
        "description":  "Separador físico temporal de carriles o protección de zona de obra."
    },
    {
        "id":  "tran_10",
        "name":  "Personas trabajando",
        "category":  "transitorias",
        "image":  "img/senales/Personas trabajando-BR9HqRud.png",
        "description":  "Indica personas realizando tareas en la calzada."
    },
    {
        "id":  "tran_11",
        "name":  "Estrechamiento de calzada",
        "category":  "transitorias",
        "image":  "img/senales/Estrechamiento de calzada-BsPxdRUo.png",
        "description":  "Señal transitoria que advierte una reducción en el ancho de la calzada por obras."
    },
    {
        "id":  "tran_13",
        "name":  "Valla de obra",
        "category":  "transitorias",
        "image":  "img/senales/Valla de obra-Du1SSL8p.png",
        "description":  "Barrera temporal para delimitar zonas de trabajo o peligro."
    },
    {
        "id":  "tran_14",
        "name":  "Tambor de obra",
        "category":  "transitorias",
        "image":  "img/senales/senalg_nP.png",
        "description":  "Dispositivo canalizador para guiar el tránsito en zonas de obra."
    },
    {
        "id":  "hor_1",
        "name":  "Flecha combinada",
        "category":  "horizontales",
        "image":  "img/senales/senalg_iP.png",
        "description":  "Indica posibilidad de seguir recto o girar."
    },
    {
        "id":  "hor_2",
        "name":  "Flecha simple",
        "category":  "horizontales",
        "image":  "img/senales/senalg_sP.png",
        "description":  "Indica dirección obligatoria de circulación."
    },
    {
        "id":  "hor_3",
        "name":  "Senda para ciclistas",
        "category":  "horizontales",
        "image":  "img/senales/Senda para ciclistas-CHrNBAtS.png",
        "description":  "Sector de la calzada destinado al cruce de bicicletas."
    },
    {
        "id":  "hor_5",
        "name":  "Línea de carril continua",
        "category":  "horizontales",
        "image":  "img/senales/senalg_lP.png",
        "description":  "Delimita carriles y prohíbe el cambio de los mismos."
    },
    {
        "id":  "hor_6",
        "name":  "Línea de carril discontinua",
        "category":  "horizontales",
        "image":  "img/senales/senalg_uP.png",
        "description":  "Delimita carriles y permite el sobrepaso si es seguro."
    },
    {
        "id":  "hor_7",
        "name":  "Línea individual continua",
        "category":  "horizontales",
        "image":  "img/senales/senalg_pP.png",
        "description":  "Separa corrientes de tránsito de igual sentido."
    },
    {
        "id":  "hor_8",
        "name":  "Líneas divisorias paralelas continuas",
        "category":  "horizontales",
        "image":  "img/senales/senalg_hP.png",
        "description":  "Prohíbe estrictamente el cambio de carril."
    },
    {
        "id":  "hor_9",
        "name":  "Líneas para carriles reversibles",
        "category":  "horizontales",
        "image":  "img/senales/senalg_fP.png",
        "description":  "Delimita carriles cuyo sentido varía según el horario."
    },
    {
        "id":  "hor_10",
        "name":  "Líneas auxiliares para reducción de velocidad",
        "category":  "horizontales",
        "image":  "img/senales/Lìneas auxiliares para reducciòn de velocidad-Bb4hOAte.png",
        "description":  "Marcas que generan efecto visual para bajar la velocidad."
    },
    {
        "id":  "hor_11",
        "name":  "Marcas especiales canalizadoras",
        "category":  "horizontales",
        "image":  "img/senales/Marcas especiales canalizadoras del trànsito-Bn4s65Zx.png",
        "description":  "Cebreados o achurados para guiar el flujo en intersecciones."
    },
    {
        "id":  "hor_12",
        "name":  "Línea divisoria continua/discontinua",
        "category":  "horizontales",
        "image":  "img/senales/senalg_dP.png",
        "description":  "Permite el sobrepaso solo para el lado que tiene la línea discontinua."
    },
    {
        "id":  "hor_13",
        "name":  "Cruce ferroviario",
        "category":  "horizontales",
        "image":  "img/senales/Cruce ferroviario-liRKT5vr.png",
        "description":  "Marca vial que advierte sobre la proximidad de un cruce con vías férreas."
    }
];
if (typeof module !== 'undefined') module.exports = SENALES_DATA;