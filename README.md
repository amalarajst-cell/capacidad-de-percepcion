# 🏎️ Capacidad de Percepción - Test de Reacción F1 para Stand

Aplicación interactiva diseñada para stands en la vía pública o exposiciones educativas, con estética de alta energía tipo **Red Bull Racing / Fórmula 1** y los colores institucionales de la escuela (**Azul Marino, Amarillo Competición y Blanco**).

---

## 🚀 Inicio Rápido

Tenés dos formas súper sencillas de usarla:

### Opción 1: En una sola laptop o pantalla (Sin instalar nada)
- Hacé doble clic en **`INICIAR_APP.bat`** (o abrí directamente `index.html` en Chrome, Edge o Firefox).
- Podés abrir una pestaña con **`index.html`** (para los participantes) y otra pestaña o monitor extendido con **`admin.html`** (para ver el ranking y podio en vivo).
- La sincronización entre ambas pantallas es instantánea y automática mediante canales locales en tiempo real (`BroadcastChannel`).

### Opción 2: Conectar Tablets, Celulares y TV por Wi-Fi / Hotspot
- Hacé doble clic en **`INICIAR_SERVIDOR_WIFI.bat`**.
- La ventana de comandos te mostrará la dirección IP local (por ejemplo `http://192.168.1.50:3000`).
- Cualquier celular o tablet conectada a la misma red Wi-Fi (o a la zona portátil de tu celular) podrá ingresar al test desde su navegador.
- En la laptop o pantalla grande abrís `http://localhost:3000/admin.html` en modo pantalla completa (**F11** o el botón "Pantalla Completa").

---

## 🏁 Dinámica del Test de Reacción

1. **Registro:** El participante ingresa su **Nombre y Apellido** y su **Correo Electrónico**.
2. **Semáforo F1:**
   - 5 columnas de luces rojas se encienden sucesivamente con beeps sonoros rítmicos.
   - Cuando las 5 luces están encendidas, hay una pausa aleatoria e impredecible (como la FIA en las carreras de F1).
   - **Salida en Falso (Jump Start):** Si el participante se anticipa y toca la pantalla antes de que se apaguen, el sistema emite una alarma sonora y visual de penalización permitiéndole reiniciar calmadamente.
   - **¡Luces Apagadas! (Go!):** Las luces se apagan y la pantalla destella en verde de alta velocidad. El participante debe tocar la pantalla lo más rápido posible.
3. **Telemetría Instantánea:**
   - Se muestra el tiempo exacto en milisegundos (`ms`).
   - Se compara con los reflejos de un piloto de Fórmula 1 (~200 ms).
   - Se clasifica el rendimiento (Piloto F1 Élite, Reflejos Sobrenaturales, Conductor Deportivo Pro, etc.).
   - El resultado **impacta en vivo en la pantalla del Panel de Administración**.

---

## 📊 Panel de Administración & Leaderboard en Vivo (`admin.html`)

- **Podio Top 3:** Puestos de Oro, Plata y Bronce con nombres y tiempos en vivo.
- **Métricas:** Total de participantes registrados, récord absoluto del día y tiempo promedio de reacción.
- **Tabla en Vivo:** Muestra los participantes ordenados por velocidad de reacción, con animación cuando entra uno nuevo.
- **Buscador en tiempo real:** Permite filtrar por nombre o mail.
- **Exportar a Excel (CSV):** Descarga inmediata con un clic de todos los contactos registrados (Nombre, Email, Tiempo, Categoría, Fecha y Hora) formateado para Excel (`.csv` UTF-8).
- **Cargar datos de prueba:** Botón para poblar rápidamente el podio antes de abrir el stand para calibrar la visualización en la TV.
- **Reiniciar registros:** Botón con confirmación para limpiar la base de datos al inicio de una nueva jornada.

---

## 🎨 Personalización del Logo

El logo institucional se encuentra en `assets/logo.png`. Podés reemplazarlo en cualquier momento por cualquier imagen PNG o SVG con el mismo nombre y se actualizará automáticamente tanto en la app del participante como en el panel de control.
