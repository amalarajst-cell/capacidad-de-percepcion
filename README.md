# 🏎️ Centro de Formación Laboral 412 | Manejo Seguro - Capacidad de Percepción

Aplicación web interactiva de alta velocidad diseñada para el **Centro de Formación Laboral 412 (Manejo Seguro)** para stands en la vía pública o exposiciones educativas, con estética de alta energía tipo **Motorsport / Dark Mode** y los colores institucionales (**Azul Marino, Amarillo Competición y Blanco**).

---

## 🌐 Enlaces en Vivo (GitHub Pages)

- 🎨 **App del Test de Reacción a Colores (Participantes):**  
  [https://amalarajst-cell.github.io/capacidad-de-percepcion/](https://amalarajst-cell.github.io/capacidad-de-percepcion/)

- 📊 **Panel de Control & Leaderboard TV Stand (Admin):**  
  [https://amalarajst-cell.github.io/capacidad-de-percepcion/admin.html](https://amalarajst-cell.github.io/capacidad-de-percepcion/admin.html)

- 📦 **Repositorio en GitHub:**  
  [https://github.com/amalarajst-cell/capacidad-de-percepcion](https://github.com/amalarajst-cell/capacidad-de-percepcion)

---

## 🎮 Modalidad Principal: Desafío de Reflejos Cromáticos

El participante ingresa su **Nombre y Apellido** y su **Correo Electrónico**, e ingresa directamente al desafío de discriminación y tiempo de reacción:

### 🎯 Dinámica de Juego:
1. **Comenzar Nivel:** Al pulsar `▷ COMENZAR NIVEL` (o la barra espaciadora), el sistema entra en fase de espera y concentración.
2. **Detección Anti-Anticipación:** Si el participante toca un botón o presiona una tecla antes de que aparezca el color, se activa una penalización sonora y visual por salida en falso.
3. **Estímulo Cromático Sorpresa:** En un lapso aleatorio e impredecible (entre 1.4s y 3.4s), el orbe central se enciende intensamente con uno de los 4 colores al azar:
   - 🔴 **ROJO** (Detención)
   - 🟡 **AMARILLO** (Precaución)
   - 🟢 **VERDE** (Avanzar)
   - 🔵 **AZUL** (Información)
4. **Métricas de Alta Precisión:** Se mide el tiempo de respuesta milimétrico (`ms`) del participante al presionar el color correcto. Si presiona el color incorrecto, el sistema avisa del error sonoro y visual para reintentar.

---

## 📊 Panel de Administración & Leaderboard en Vivo (`admin.html`)

- **Acceso Administrativo Discreto:** Desde la pantalla del participante, podés acceder en cualquier momento al panel de control presionando **`Control + Alt + A`**.
- **Impacto en Tiempo Real:** Los tiempos impactan instantáneamente al completarse el test.
- **Podio Top 3:** Puestos de Oro, Plata y Bronce con nombres y tiempos en vivo.
- **Modalidad Oficial del Stand:** Actividad psicomotriz central *Reacción a Colores* (5 intentos por participante con cálculo de promedio y mejor tiempo).
- **Métricas:** Total de participantes registrados, récord absoluto de la jornada y tiempo promedio de reacción.
- **Buscador en Vivo:** Permite buscar participantes rápidamente por nombre o correo electrónico.
- **Exportar a Excel (CSV):** Descarga inmediata con un clic de todos los contactos registrados (Posición, Nivel/Modalidad, Nombre, Email, Tiempo ms, Categoría, Fecha y Hora) formateado para Excel (`.csv` UTF-8 BOM).
- **Cargar datos de prueba:** Botón para poblar rápidamente el podio antes de abrir el stand para calibrar la visualización en la TV.
- **Reiniciar registros:** Botón con confirmación para limpiar la base de datos al inicio de una nueva jornada.

---

## 🚀 Modos de Ejecución Local (Offline para la Calle)

Si el stand se encuentra en la calle y la señal de internet de celular es inestable, el sistema puede operar 100% sin conexión:

### Opción 1: En una sola laptop o pantalla (Sin instalar nada)
- Hacé doble clic en **`INICIAR_APP.bat`** (o abrí directamente `index.html` en Chrome, Edge o Firefox).
- En una pestaña dejás `index.html` para los participantes y en otra `admin.html` (o en un monitor secundario / TV).
- La sincronización es instantánea y automática mediante canales locales en tiempo real (`BroadcastChannel`).

### Opción 2: Conectar Tablets, Celulares y TV por Wi-Fi / Zona Portátil
- Hacé doble clic en **`INICIAR_SERVIDOR_WIFI.bat`** (corre sobre el PowerShell nativo de Windows, sin necesidad de instalar Node ni Python).
- La ventana te indicará la dirección IP local (ejemplo `http://192.168.1.XX:3000`).
- Cualquier celular o tablet conectada a la misma red Wi-Fi podrá ingresar al test desde su navegador.
- En la laptop o pantalla grande abrís `admin.html` en modo pantalla completa (**F11** o el botón "Pantalla Completa").

---

## 🎨 Personalización del Logo

El logo institucional se encuentra en `assets/logo.png`. Podés reemplazarlo en cualquier momento por cualquier imagen PNG o SVG con el mismo nombre y se actualizará automáticamente tanto en la app del participante como en el panel de control.
