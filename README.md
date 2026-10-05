# 🏎️ Capacidad de Percepción - Test de Reacción F1 & Colores para Stand

Aplicación web interactiva de alta velocidad diseñada para stands en la vía pública o exposiciones educativas, con estética de alta energía tipo **Red Bull Racing / Fórmula 1** y los colores institucionales (**Azul Marino, Amarillo Competición y Blanco**).

---

## 🌐 Enlaces en Vivo (GitHub Pages)

- 🏎️ **App del Test de Reacción (Participantes):**  
  [https://amalarajst-cell.github.io/capacidad-de-percepcion/](https://amalarajst-cell.github.io/capacidad-de-percepcion/)

- 📊 **Panel de Control & Leaderboard TV Stand (Admin):**  
  [https://amalarajst-cell.github.io/capacidad-de-percepcion/admin.html](https://amalarajst-cell.github.io/capacidad-de-percepcion/admin.html)

- 📦 **Repositorio en GitHub:**  
  [https://github.com/amalarajst-cell/capacidad-de-percepcion](https://github.com/amalarajst-cell/capacidad-de-percepcion)

---

## 🎮 Niveles de Desafío Disponibles

El participante ingresa su **Nombre y Apellido** y su **Correo Electrónico**, y puede elegir entre dos modalidades:

### 🚦 Nivel 1: Semáforo F1 (Grid de Largada)
- 5 columnas de luces rojas se encienden sucesivamente con beeps rítmicos.
- Intervalo aleatorio de espera e impredecible (como la FIA en carreras de Gran Premio).
- **Salida en Falso (*Jump Start*):** Si toca antes de que se apaguen las luces, se activa una alarma sonora y visual de penalización.
- **¡Luces Apagadas!:** Las luces se apagan instantáneamente y se mide el tiempo de respuesta milimétrico.

### 🎨 Nivel 2: Solo Colores (Reflejo Cromático Sorpresa)
- Orbe visual central en color **Rojo 🔴** con aviso de detención y concentración.
- **Detección Anti-Anticipación:** Si el participante toca mientras está en rojo, se detecta el toque prematuro.
- **Cambio Cromático Explosivo:** En un lapso sorpresa, el orbe cambia instantáneamente a **Verde 🟢, Amarillo 🟡 o Azul 🔵** y la pantalla destella ordenando el toque inmediato.

---

## 📊 Panel de Administración & Leaderboard en Vivo (`admin.html`)

- **Impacto en Tiempo Real:** Los tiempos impactan instantáneamente al completarse el test.
- **Podio Top 3:** Puestos de Oro, Plata y Bronce con nombres y tiempos en vivo.
- **Filtro por Modalidad:** Permite ver el ranking general de todos los niveles o filtrar solo por *Semáforo F1* o *Solo Colores*.
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
