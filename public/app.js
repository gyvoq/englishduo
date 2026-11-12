(function () {
  'use strict';

  var CONFIG = {
    checkoutUrl: 'https://pay.cakto.com.br/f593h8h_922503',
    priceLabel: '',
    perPage: 5
  };

  var ICONS = {"arrows-out": "<path d=\"M220,48V96a12,12,0,0,1-24,0V77l-35.51,35.52a12,12,0,0,1-17-17L179,60H160a12,12,0,0,1,0-24h48A12,12,0,0,1,220,48ZM95.51,143.51,60,179V160a12,12,0,0,0-24,0v48a12,12,0,0,0,12,12H96a12,12,0,0,0,0-24H77l35.52-35.51a12,12,0,0,0-17-17ZM208,148a12,12,0,0,0-12,12v19l-35.51-35.52a12,12,0,0,0-17,17L179,196H160a12,12,0,0,0,0,24h48a12,12,0,0,0,12-12V160A12,12,0,0,0,208,148ZM77,60H96a12,12,0,0,0,0-24H48A12,12,0,0,0,36,48V96a12,12,0,0,0,24,0V77l35.51,35.52a12,12,0,0,0,17-17Z\"/>", "magnifying-glass": "<path d=\"M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z\"/>", "x": "<path d=\"M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z\"/>", "arrow-left": "<path d=\"M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z\"/>", "arrow-up-right": "<path d=\"M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z\"/>", "house": "<path d=\"M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z\"/>", "chart-bar": "<path d=\"M224,196h-4V40a12,12,0,0,0-12-12H152a12,12,0,0,0-12,12V76H96A12,12,0,0,0,84,88v36H48a12,12,0,0,0-12,12v60H32a12,12,0,0,0,0,24H224a12,12,0,0,0,0-24ZM164,52h32V196H164Zm-56,48h32v96H108ZM60,148H84v48H60Z\"/>", "key": "<path d=\"M196,76a16,16,0,1,1-16-16A16,16,0,0,1,196,76Zm48,22.74A84.3,84.3,0,0,1,160.11,180H160a83.52,83.52,0,0,1-23.65-3.38l-7.86,7.87A12,12,0,0,1,120,188H108v12a12,12,0,0,1-12,12H84v12a12,12,0,0,1-12,12H40a20,20,0,0,1-20-20V187.31a19.86,19.86,0,0,1,5.86-14.14l53.52-53.52A84,84,0,1,1,244,98.74ZM202.43,53.57A59.48,59.48,0,0,0,158,36c-32,1-58,27.89-58,59.89a59.69,59.69,0,0,0,4.2,22.19,12,12,0,0,1-2.55,13.21L44,189v23H60V200a12,12,0,0,1,12-12H84V176a12,12,0,0,1,12-12h19l9.65-9.65a12,12,0,0,1,13.22-2.55A59.58,59.58,0,0,0,160,156h.08c32,0,58.87-26.07,59.89-58A59.55,59.55,0,0,0,202.43,53.57Z\"/>", "lock-fill": "<path d=\"M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Zm32-84H96V56a32,32,0,0,1,64,0Z\"/>", "check": "<path d=\"M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z\"/>", "check-circle-fill": "<path d=\"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z\"/>", "x-circle-fill": "<path d=\"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z\"/>", "seal-check-fill": "<path d=\"M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z\"/>", "list-checks": "<path d=\"M228,128a12,12,0,0,1-12,12H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128ZM128,76h88a12,12,0,0,0,0-24H128a12,12,0,0,0,0,24Zm88,104H128a12,12,0,0,0,0,24h88a12,12,0,0,0,0-24ZM79.51,39.51,56,63l-7.51-7.52a12,12,0,0,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,127l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,191l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Z\"/>", "chat-text": "<path d=\"M216,44H40A20,20,0,0,0,20,64V224A19.82,19.82,0,0,0,31.56,242.1a20.14,20.14,0,0,0,8.49,1.9,19.91,19.91,0,0,0,12.82-4.72l.12-.11L84.47,212H216a20,20,0,0,0,20-20V64A20,20,0,0,0,216,44Zm-4,144H80a11.93,11.93,0,0,0-7.84,2.92L44,215.23V68H212ZM84,108A12,12,0,0,1,96,96h64a12,12,0,1,1,0,24H96A12,12,0,0,1,84,108Zm0,40a12,12,0,0,1,12-12h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,148Z\"/>", "warning-circle": "<path d=\"M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z\"/>", "lock-open": "<path d=\"M208,76H100V56a28,28,0,0,1,28-28c13.51,0,25.65,9.62,28.24,22.39a12,12,0,1,0,23.52-4.78C174.87,21.5,153.1,4,128,4A52.06,52.06,0,0,0,76,56V76H48A20,20,0,0,0,28,96V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V96A20,20,0,0,0,208,76Zm-4,128H52V100H204Zm-92-52a16,16,0,1,1,16,16A16,16,0,0,1,112,152Z\"/>", "arrow-down": "<path d=\"M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z\"/>", "play-circle": "<path d=\"M176,128a12,12,0,0,1-5.17,9.87l-52,36A12,12,0,0,1,100,164V92a12,12,0,0,1,18.83-9.87l52,36A12,12,0,0,1,176,128Zm60,0A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z\"/>", "arrow-right": "<path d=\"M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z\"/>", "caret-down": "<path d=\"M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z\"/>", "plant": "<path d=\"M255.62,51.65a12,12,0,0,0-11.27-11.27c-53.27-3.13-96.2,13.36-114.84,44.14-12.14,20-12.56,44.17-1.46,67.3a75.14,75.14,0,0,0-12.28,23l-12.66-12.66c7.19-16.77,6.43-34.11-2.4-48.69C86.73,90.36,54.89,78,15.55,80.27A12,12,0,0,0,4.28,91.55C2,130.89,14.36,162.73,37.45,176.71a49.76,49.76,0,0,0,26,7.27,57.54,57.54,0,0,0,22.7-4.87L112,205v23a12,12,0,0,0,24,0V198.51a51.63,51.63,0,0,1,9.49-29.95,76.82,76.82,0,0,0,32.1,7.39,64.91,64.91,0,0,0,33.89-9.46C242.25,147.85,258.76,104.92,255.62,51.65ZM49.88,156.18c-13.19-8-21.18-27.46-21.83-52.13,24.67.65,44.14,8.64,52.13,21.83a26,26,0,0,1,3.63,17L72.48,131.51a12,12,0,0,0-17,17l11.34,11.34A26.27,26.27,0,0,1,49.88,156.18ZM199.05,146c-10.66,6.45-23,7.67-35.81,3.76l37.25-37.24a12,12,0,0,0-17-17l-37.25,37.24C142.37,120,143.59,107.61,150,97c12.7-21,42.65-33,81.32-33H232C232.14,103,220.14,133.18,199.05,146Z\"/>", "text-aa": "<path d=\"M90.86,50.89a12,12,0,0,0-21.72,0l-64,136a12,12,0,0,0,21.71,10.22L42.44,164h75.12l15.58,33.11a12,12,0,0,0,21.72-10.22ZM53.74,140,80,84.18,106.27,140ZM200,84c-13.85,0-24.77,3.86-32.45,11.48a12,12,0,1,0,16.9,17c3-3,8.26-4.52,15.55-4.52,11,0,20,7.18,20,16v4.39A47.28,47.28,0,0,0,200,124c-24.26,0-44,17.94-44,40s19.74,40,44,40a47.18,47.18,0,0,0,22-5.38A12,12,0,0,0,244,192V124C244,101.94,224.26,84,200,84Zm0,96c-11,0-20-7.18-20-16s9-16,20-16,20,7.18,20,16S211,180,200,180Z\"/>", "wrench": "<path d=\"M230.47,67.5a12,12,0,0,0-19.26-4.32L172.43,99l-12.68-2.72L157,83.57l35.79-38.78a12,12,0,0,0-4.32-19.26A76.07,76.07,0,0,0,88.41,121.64L30.92,174.18a4.68,4.68,0,0,0-.39.38,36,36,0,0,0,50.91,50.91l.38-.39,52.54-57.49A76.05,76.05,0,0,0,230.47,67.5ZM160,148a51.5,51.5,0,0,1-23.35-5.52,12,12,0,0,0-14.26,2.62L64.31,208.66a12,12,0,0,1-17-17l63.55-58.07a12,12,0,0,0,2.62-14.26A51.5,51.5,0,0,1,108,96a52.06,52.06,0,0,1,52-52h.89L135.17,71.87a12,12,0,0,0-2.91,10.65l5.66,26.35a12,12,0,0,0,9.21,9.21l26.35,5.66a12,12,0,0,0,10.65-2.91L212,95.12c0,.3,0,.59,0,.89A52.06,52.06,0,0,1,160,148Z\"/>", "graduation-cap": "<path d=\"M249.8,85.49l-116-64a12,12,0,0,0-11.6,0l-116,64a12,12,0,0,0,0,21l21.8,12v47.76a19.89,19.89,0,0,0,5.09,13.32C46.63,194.7,77,220,128,220a136.88,136.88,0,0,0,40-5.75V240a12,12,0,0,0,24,0V204.12a119.53,119.53,0,0,0,30.91-24.51A19.89,19.89,0,0,0,228,166.29V118.53l21.8-12a12,12,0,0,0,0-21ZM128,45.71,219.16,96,186,114.3a1.88,1.88,0,0,1-.18-.12l-52-28.69a12,12,0,0,0-11.6,21l39,21.49L128,146.3,36.84,96ZM128,196c-40.42,0-64.65-19.07-76-31.27v-33l70.2,38.74a12,12,0,0,0,11.6,0L168,151.64v37.23A110.46,110.46,0,0,1,128,196Zm76-31.27a93.21,93.21,0,0,1-12,10.81V138.39l12-6.62Z\"/>", "signpost": "<path d=\"M248.92,104,215.3,66.62A20,20,0,0,0,200.44,60H140V32a12,12,0,0,0-24,0V60H40A20,20,0,0,0,20,80v64a20,20,0,0,0,20,20h76v60a12,12,0,0,0,24,0V164h60.44a20,20,0,0,0,14.86-6.62L248.92,120A12,12,0,0,0,248.92,104Zm-50.26,36H44V84H198.66l25.2,28Z\"/>", "books": "<path d=\"M235.57,193.73,202.38,35.93a20,20,0,0,0-23.76-15.48L131.81,30.51a19.82,19.82,0,0,0-11,6.65A20,20,0,0,0,104,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20h48a20,20,0,0,0,20-20V90.25l25.62,121.82A20,20,0,0,0,169.15,228a20.27,20.27,0,0,0,4.23-.45l46.81-10.06A20.1,20.1,0,0,0,235.57,193.73ZM148.19,88.65l39-8.38,2.53,12-39,8.38Zm7.46,35.5,39-8.38,9.16,43.58-39,8.38Zm24.06-79.39,2.53,12-39,8.38-2.53-12ZM60,88h40v80H60Zm40-36V64H60V52ZM60,204V192h40v12Zm112.29-.76-2.53-12,39-8.38,2.53,12Z\"/>", "translate": "<path d=\"M250.73,210.63l-56-112a12,12,0,0,0-21.46,0l-20.52,41A84.2,84.2,0,0,1,114,126.22,107.48,107.48,0,0,0,139.33,68H160a12,12,0,0,0,0-24H108V32a12,12,0,0,0-24,0V44H32a12,12,0,0,0,0,24h83.13A83.69,83.69,0,0,1,96,110.35,84,84,0,0,1,83.6,91a12,12,0,1,0-21.81,10A107.55,107.55,0,0,0,78,126.24,83.54,83.54,0,0,1,32,140a12,12,0,0,0,0,24,107.47,107.47,0,0,0,64-21.07,108.4,108.4,0,0,0,45.39,19.44l-24.13,48.26a12,12,0,1,0,21.46,10.73L151.41,196h65.17l12.68,25.36a12,12,0,1,0,21.47-10.73ZM163.41,172,184,130.83,204.58,172Z\"/>", "briefcase": "<path d=\"M100,100a12,12,0,0,1,12-12h32a12,12,0,0,1,0,24H112A12,12,0,0,1,100,100ZM236,68V196a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V68A20,20,0,0,1,40,48H76V40a28,28,0,0,1,28-28h48a28,28,0,0,1,28,28v8h36A20,20,0,0,1,236,68ZM100,48h56V40a4,4,0,0,0-4-4H104a4,4,0,0,0-4,4ZM44,72v35.23A180.06,180.06,0,0,0,128,128a180,180,0,0,0,84-20.78V72ZM212,192V133.94A204.27,204.27,0,0,1,128,152a204.21,204.21,0,0,1-84-18.06V192Z\"/>", "link": "<path d=\"M117.18,188.74a12,12,0,0,1,0,17l-5.12,5.12A58.26,58.26,0,0,1,70.6,228h0A58.62,58.62,0,0,1,29.14,127.92L63.89,93.17a58.64,58.64,0,0,1,98.56,28.11,12,12,0,1,1-23.37,5.44,34.65,34.65,0,0,0-58.22-16.58L46.11,144.89A34.62,34.62,0,0,0,70.57,204h0a34.41,34.41,0,0,0,24.49-10.14l5.11-5.12A12,12,0,0,1,117.18,188.74ZM226.83,45.17a58.65,58.65,0,0,0-82.93,0l-5.11,5.11a12,12,0,0,0,17,17l5.12-5.12a34.63,34.63,0,1,1,49,49L175.1,145.86A34.39,34.39,0,0,1,150.61,156h0a34.63,34.63,0,0,1-33.69-26.72,12,12,0,0,0-23.38,5.44A58.64,58.64,0,0,0,150.56,180h.05a58.28,58.28,0,0,0,41.47-17.17l34.75-34.75a58.62,58.62,0,0,0,0-82.91Z\"/>", "airplane-tilt": "<path d=\"M190,115.31,217.21,89.7l.26-.26a36,36,0,0,0-50.91-50.91c-.09.08-.17.17-.26.26L140.69,66,60.1,36.71A12,12,0,0,0,47.52,39.5l-24,24A12,12,0,0,0,25.34,82l59.83,39.88L75,132H56a12,12,0,0,0-8.48,3.51l-24,24a12,12,0,0,0,4,19.62l35.23,14.1,14.06,35.14.09.22a12,12,0,0,0,19.76,3.7l23.81-23.81A12,12,0,0,0,124,200V181l10.13-10.13L174,230.65a12,12,0,0,0,18.47,1.83l24-24a12,12,0,0,0,2.79-12.59Zm-4.11,89.85L146,145.33a12,12,0,0,0-8.8-5.28A11.66,11.66,0,0,0,136,140a12,12,0,0,0-8.49,3.52l-24,24A12,12,0,0,0,100,176v19l-7.62,7.62-9.24-23.1a12,12,0,0,0-6.69-6.69l-23.1-9.24L61,156H80a12,12,0,0,0,8.48-3.51l24-24A12,12,0,0,0,110.66,110L50.84,70.12l8.24-8.25,80.83,29.39a12,12,0,0,0,12.84-3.05l30.89-32.82a12,12,0,0,1,17,17l-32.82,30.89a12,12,0,0,0-3.06,12.84l29.4,80.82Z\"/>", "presentation-chart": "<path d=\"M216,36H140V24a12,12,0,0,0-24,0V36H40A20,20,0,0,0,20,56V176a20,20,0,0,0,20,20H71l-16.4,20.5a12,12,0,0,0,18.74,15l28.4-35.5h52.46l28.4,35.5a12,12,0,0,0,18.74-15L185,196h31a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36Zm-4,136H44V60H212ZM104,120v24a12,12,0,0,1-24,0V120a12,12,0,0,1,24,0Zm24-28a12,12,0,0,1,12,12v40a12,12,0,0,1-24,0V104A12,12,0,0,1,128,92Zm24,52V88a12,12,0,0,1,24,0v56a12,12,0,0,1-24,0Z\"/>", "chat-circle-text": "<path d=\"M172,108a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,108Zm-12,28H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm76-8A108,108,0,0,1,78.77,224.15L46.34,235A20,20,0,0,1,21,209.66l10.81-32.43A108,108,0,1,1,236,128Zm-24,0A84,84,0,1,0,55.27,170.06a12,12,0,0,1,1,9.81l-9.93,29.79,29.79-9.93a12.1,12.1,0,0,1,3.8-.62,12,12,0,0,1,6,1.62A84,84,0,0,0,212,128Z\"/>", "book-open-text": "<path d=\"M232,44H160a43.86,43.86,0,0,0-32,13.85A43.86,43.86,0,0,0,96,44H24A12,12,0,0,0,12,56V200a12,12,0,0,0,12,12H96a20,20,0,0,1,20,20,12,12,0,0,0,24,0,20,20,0,0,1,20-20h72a12,12,0,0,0,12-12V56A12,12,0,0,0,232,44ZM96,188H36V68H96a20,20,0,0,1,20,20V192.81A43.79,43.79,0,0,0,96,188Zm124,0H160a43.71,43.71,0,0,0-20,4.83V88a20,20,0,0,1,20-20h60ZM164,96h32a12,12,0,0,1,0,24H164a12,12,0,0,1,0-24Zm44,52a12,12,0,0,1-12,12H164a12,12,0,0,1,0-24h32A12,12,0,0,1,208,148Z\"/>", "pen-nib": "<path d=\"M252,92.68a19.86,19.86,0,0,0-5.86-14.14L177.46,9.85a20,20,0,0,0-28.29,0L121.35,37.67,64.11,59.14A20,20,0,0,0,51.4,74.58L28.16,214A12,12,0,0,0,40,228a11.9,11.9,0,0,0,2-.16l139.45-23.25a20.07,20.07,0,0,0,15.44-12.7l21.46-57.25,27.82-27.82A19.85,19.85,0,0,0,252,92.68ZM175.2,181.3,75,198l33-33a34,34,0,1,0-17-17L58,181,74.7,80.8,125,61.94,194.05,131ZM112,134a10,10,0,1,1,10,10A10,10,0,0,1,112,134Zm96-23L145,48l18.34-18.34,63,63Z\"/>", "headphones": "<path d=\"M204.73,51.85A108.07,108.07,0,0,0,20,128v56a28,28,0,0,0,28,28H64a28,28,0,0,0,28-28V144a28,28,0,0,0-28-28H44.84A84.05,84.05,0,0,1,128,44h.64a83.7,83.7,0,0,1,82.52,72H192a28,28,0,0,0-28,28v40a28,28,0,0,0,28,28h16a28,28,0,0,0,28-28V128A107.34,107.34,0,0,0,204.73,51.85ZM64,140a4,4,0,0,1,4,4v40a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V140Zm148,44a4,4,0,0,1-4,4H192a4,4,0,0,1-4-4V144a4,4,0,0,1,4-4h20Z\"/>", "certificate": "<path d=\"M128,140a12,12,0,0,1-12,12H72a12,12,0,0,1,0-24h44A12,12,0,0,1,128,140ZM116,88H72a12,12,0,0,0,0,24h44a12,12,0,0,0,0-24Zm120,79.14V228a12,12,0,0,1-17.95,10.42L196,225.82,174,238.42A12,12,0,0,1,156,228V204H40a20,20,0,0,1-20-20V56A20,20,0,0,1,40,36H216a20,20,0,0,1,20,20V88.86a55.87,55.87,0,0,1,0,78.28ZM196,160a32,32,0,1,0-32-32A32,32,0,0,0,196,160Zm-40,20V167.14a56,56,0,0,1,56-92.8V60H44V180Zm56,27.32V181.66a55.87,55.87,0,0,1-32,0v25.66l10.05-5.74a12,12,0,0,1,11.9,0Z\"/>", "speaker-high": "<path d=\"M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm54-106.08a40,40,0,0,1,0,52.88,8,8,0,1,1-12-10.58,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.58ZM248,128a79.9,79.9,0,0,1-20.37,53.34,8,8,0,0,1-11.92-10.67,64,64,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67A79.83,79.83,0,0,1,248,128Z\"/>", "medal": "<path d=\"M220,96A92,92,0,1,0,68,165.69V240a12,12,0,0,0,17.37,10.73L128,229.42l42.64,21.31A12,12,0,0,0,188,240V165.69A91.86,91.86,0,0,0,220,96ZM60,96a68,68,0,1,1,68,68A68.07,68.07,0,0,1,60,96ZM164,220.59l-30.64-15.32a12,12,0,0,0-10.74,0L92,220.58V180.66a92,92,0,0,0,72,0ZM128,148A52,52,0,1,0,76,96,52.06,52.06,0,0,0,128,148Zm0-80a28,28,0,1,1-28,28A28,28,0,0,1,128,68Z\"/>", "download-simple": "<path d=\"M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z\"/>", "file-pdf": "<path d=\"M200,164v8h12a12,12,0,0,1,0,24H200v12a12,12,0,0,1-24,0V152a12,12,0,0,1,12-12h32a12,12,0,0,1,0,24ZM92,172a32,32,0,0,1-32,32H56v4a12,12,0,0,1-24,0V152a12,12,0,0,1,12-12H60A32,32,0,0,1,92,172Zm-24,0a8,8,0,0,0-8-8H56v16h4A8,8,0,0,0,68,172Zm100,8a40,40,0,0,1-40,40H112a12,12,0,0,1-12-12V152a12,12,0,0,1,12-12h16A40,40,0,0,1,168,180Zm-24,0a16,16,0,0,0-16-16h-4v32h4A16,16,0,0,0,144,180ZM36,108V40A20,20,0,0,1,56,20h96a12,12,0,0,1,8.49,3.52l56,56A12,12,0,0,1,220,88v20a12,12,0,0,1-24,0v-4H148a12,12,0,0,1-12-12V44H60v64a12,12,0,0,1-24,0ZM160,57V80h23Z\"/>", "paper-plane-right": "<path d=\"M240,127.89a16,16,0,0,1-8.18,14L63.9,237.9A16.15,16.15,0,0,1,56,240a16,16,0,0,1-15-21.33l27-79.95A4,4,0,0,1,71.72,136H144a8,8,0,0,0,8-8.53,8.19,8.19,0,0,0-8.26-7.47h-72a4,4,0,0,1-3.79-2.72l-27-79.94A16,16,0,0,1,63.84,18.07l168,95.89A16,16,0,0,1,240,127.89Z\"/>", "user-circle": "<path d=\"M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z\"/>", "sign-out": "<path d=\"M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z\"/>", "chat-circle-dots": "<path d=\"M120,128a16,16,0,1,1-16-16A16,16,0,0,1,120,128Zm32-16a16,16,0,1,0,16,16A16,16,0,0,0,152,112Zm84,16A108,108,0,0,1,78.77,224.15L46.34,235A20,20,0,0,1,21,209.66l10.81-32.43A108,108,0,1,1,236,128Zm-24,0A84,84,0,1,0,55.27,170.06a12,12,0,0,1,1,9.81l-9.93,29.79,29.79-9.93a12.1,12.1,0,0,1,3.8-.62,12,12,0,0,1,6,1.62A84,84,0,0,0,212,128Z\"/>", "caret-right": "<path d=\"M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z\"/>", "caret-left": "<path d=\"M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z\"/>", "play-fill": "<path d=\"M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z\"/>", "video-camera-slash": "<path d=\"M249.45,69.31a12,12,0,0,0-12.51,1L212,88.43V72a20,20,0,0,0-20-20H123.88a12,12,0,0,0,0,24H188v68a12,12,0,0,0,4.46,9.33c.15.13.31.25.48.38l44,32A12,12,0,0,0,256,176V80A12,12,0,0,0,249.45,69.31ZM232,152.43l-20-14.54V118.11l20-14.54ZM56.88,31.93A12,12,0,1,0,39.12,48.07L42.69,52H32A20,20,0,0,0,12,72V184a20,20,0,0,0,20,20H180.87l18.25,20.07a12,12,0,0,0,17.76-16.14ZM36,180V76H64.51l94.55,104Z\"/>", "users-three": "<path d=\"M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z\"/>", "file-text": "<path d=\"M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z\"/>"};

  var MODULES = [], COURSE = [], FREE = {}, TOTAL = 0, LESSONS = {}, LESSON_LIST = [];
  var PER = CONFIG.perPage;
  var LEVEL = { 1: 'Básico', 2: 'Intermediário', 3: 'Avançado' };
  var CAT = { all: 'Todos', grammar: 'Gramática', vocabulary: 'Vocabulário', skills: 'Habilidades', exams: 'Exames' };
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(n) { return '<svg class="ico" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">' + (ICONS[n] || '') + '</svg>'; }
  function plural(n, a, b) { return n === 1 ? a : b; }
  function fold(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function modById(id) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return MODULES[i]; return null; }
  function fmtDate(ts) { try { return new Date(ts).toLocaleDateString('pt-BR'); } catch (e) { return ''; } }
  function fmtTime(ts) {
    try {
      var d = new Date(ts), now = new Date();
      var t = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return d.toDateString() === now.toDateString() ? t : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + t;
    } catch (e) { return ''; }
  }

  var mem = {};
  var LS = (function () { try { var k = '__ed'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); return window.localStorage; } catch (e) { return null; } })();
  function sget(k) { try { return LS ? LS.getItem(k) : (k in mem ? mem[k] : null); } catch (e) { return k in mem ? mem[k] : null; } }
  function sset(k, v) { try { if (LS) LS.setItem(k, v); else mem[k] = v; } catch (e) { mem[k] = v; } }
  function sdel(k) { try { if (LS) LS.removeItem(k); else delete mem[k]; } catch (e) { delete mem[k]; } }

  var S = { view: 'home', filter: 'all', q: '', mod: null, page: 1, unlocked: false, me: null, progress: {}, seen: {}, pushed: false, ready: false, lesson: null };
  try { S.progress = JSON.parse(sget('ed.progress') || '{}') || {}; } catch (e) { S.progress = {}; }
  try { S.seen = JSON.parse(sget('ed.seen') || '{}') || {}; } catch (e) { S.seen = {}; }

  // ---------- servidor ----------
  function authHeaders(h) {
    var d = sget('ed.did'), t = sget('ed.st');
    if (d) h['x-did'] = d;
    if (t) h['x-st'] = t;
    return h;
  }

  // ---------- aparelho ----------
  // Sinais de HARDWARE que todos os navegadores do mesmo aparelho enxergam igual.
  // O servidor usa isso (junto com a rede) para não contar Chrome e Safari do mesmo celular como 2 aparelhos.
  var HW = null;
  function hwSignals() {
    if (HW) return HW;
    var o = {}, nav = window.navigator || {};
    try {
      var ua = nav.userAgent || '', pf = ((nav.userAgentData && nav.userAgentData.platform) || nav.platform || '') + ' ' + ua;
      var tp = nav.maxTouchPoints || 0;
      o.os = /android/i.test(ua) ? 'android'
        : (/iphone|ipad|ipod/i.test(ua) || (/mac/i.test(pf) && tp > 1)) ? 'ios'
        : /cros/i.test(ua) ? 'chromeos'
        : /win/i.test(pf) ? 'windows'
        : /mac/i.test(pf) ? 'mac'
        : /linux/i.test(pf) ? 'linux' : 'other';
    } catch (e) { o.os = 'other'; }
    try {
      var sc = window.screen, w = sc.width, h = sc.height, r = window.devicePixelRatio || 1;
      o.sw = Math.max(w, h); o.sh = Math.min(w, h);
      o.pw = Math.round(o.sw * r); o.ph = Math.round(o.sh * r);
    } catch (e) { }
    try { o.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { }
    try { o.cores = nav.hardwareConcurrency || 0; } catch (e) { }
    try {
      var c = document.createElement('canvas'), gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (gl) {
        var ext = gl.getExtension('WEBGL_debug_renderer_info');
        o.gpu = String((ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || gl.getParameter(gl.RENDERER) || '').slice(0, 200);
        var lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      }
    } catch (e) { }
    HW = o;
    return o;
  }
  // Para quem já estava logado antes desta versão: manda a impressão uma vez (e de novo só se mudar).
  function syncHw() {
    if (!S.me) return;
    var hw = hwSignals(), sig = JSON.stringify(hw);
    if (sget('ed.hw') === sig) return;
    api('/api/auth?action=hw', { method: 'POST', body: { hw: hw } }).then(function () { sset('ed.hw', sig); }).catch(function () { });
  }

  function api(path, opts) {
    opts = opts || {};
    var init = { method: opts.method || 'GET', credentials: 'same-origin', headers: authHeaders({}) };
    if (opts.body) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(opts.body); }
    return fetch(path, init).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.error || 'Algo deu errado. Tente de novo.'); e.status = r.status; e.data = j; throw e; }
        return j;
      });
    }, function () { var e = new Error('Sem conexão. Verifique a internet e tente de novo.'); e.status = 0; throw e; });
  }

  function applyContent(d) {
    MODULES = d.modules || [];
    COURSE = d.course || [];
    FREE = d.free || {};
    S.me = d.me || null;
    S.unlocked = !!S.me;
    TOTAL = MODULES.reduce(function (n, m) { return n + m.total; }, 0);
    LESSONS = {}; LESSON_LIST = [];
    COURSE.forEach(function (c) {
      c.lessons.forEach(function (l, i) { l.n = c.n; l.i = i + 1; LESSONS[l.id] = l; LESSON_LIST.push(l); });
    });
    var lbl = $('#accTabLabel'); if (lbl) lbl.textContent = S.me ? 'Conta' : 'Entrar';
  }

  function loadContent() { return api('/api/content').then(applyContent); }

  // Sessão caiu (chave revogada, expirada ou aparelho removido).
  function sessionLost() {
    if (!S.me) return;
    S.me = null; S.unlocked = false;
    loadContent().then(function () { refreshAll(); if (S.view === 'lesson') showCourses(); }).catch(function () {});
    toast('Sua sessão terminou. Entre de novo com sua chave.');
  }

  // ---------- progresso ----------
  var syncT;
  function saveProgress() {
    sset('ed.progress', JSON.stringify(S.progress));
    if (S.me) { clearTimeout(syncT); syncT = setTimeout(pushProgress, 1200); }
  }
  function pushProgress() {
    if (!S.me) return;
    api('/api/auth?action=progress', { method: 'PUT', body: { p: S.progress } }).catch(function (e) { if (e.status === 401) sessionLost(); });
  }
  function pullProgress() {
    if (!S.me) return Promise.resolve();
    return api('/api/auth?action=progress').then(function (d) {
      var p = d.p || {}, extra = false;
      for (var k in S.progress) if (!(k in p)) extra = true;
      for (var k2 in p) if (!(k2 in S.progress)) S.progress[k2] = p[k2];
      sset('ed.progress', JSON.stringify(S.progress));
      if (extra) pushProgress();
    }).catch(function () {});
  }

  function freeCount(m) { return FREE[m.id] || 0; }
  function freeTotal() { var n = 0; MODULES.forEach(function (m) { n += Math.min(freeCount(m), m.total); }); return n; }
  function freeUsed() {
    var n = 0;
    MODULES.forEach(function (m) {
      var f = Math.min(freeCount(m), m.q.length);
      for (var i = 0; i < f; i++) if (S.progress[m.q[i].id] !== undefined) n++;
    });
    return n;
  }
  function canOpen(m) { return m.q.length > 0; }
  function pageCount(m) { return Math.ceil(m.total / PER); }
  function pageAllowed(m, p) { return (p - 1) * PER < m.q.length; }
  function pageEnd(m, p) { return Math.min(p * PER, m.q.length); }
  function available(m) { return m.q.length; }

  function modStats(m) {
    var a = 0, c = 0;
    for (var i = 0; i < m.q.length; i++) {
      var v = S.progress[m.q[i].id];
      if (v !== undefined) { a++; if (v === 1) c++; }
    }
    return { answered: a, correct: c };
  }
  function totals() {
    var a = 0, c = 0;
    MODULES.forEach(function (m) { var s = modStats(m); a += s.answered; c += s.correct; });
    return { answered: a, correct: c, pct: a ? Math.round(100 * c / a) : 0 };
  }

  var MAGIC_FACTS = [
    { t: "<b>'Push'</b> não significa “puxar”. Significa <b>empurrar</b> — o oposto de 'pull'.", mod: 'falsos-cognatos' },
    { t: "Dizer <b>“I have 25 years”</b> está errado. O certo é <b>“I am 25 years old.”</b>", mod: 'erros-comuns' },
    { t: "<b>'Parents'</b> não são “parentes”. São <b>pai e mãe</b>. 'Parentes' é 'relatives'.", mod: 'falsos-cognatos' },
    { t: "<b>'Break a leg'</b> não é um pedido estranho. É como se diz <b>“boa sorte”</b> em inglês.", mod: 'idiomas' },
    { t: "<b>'College'</b> não é “colégio”. É <b>faculdade</b>. 'Colégio' se diz 'high school'.", mod: 'falsos-cognatos' },
    { t: "<b>“I am agree”</b> está errado. O certo é só <b>“I agree.”</b>", mod: 'erros-comuns' },
    { t: "<b>'Piece of cake'</b> não tem nada a ver com bolo — significa algo <b>muito fácil</b>.", mod: 'idiomas' },
    { t: "<b>'Realize'</b> não é “realizar”. Significa <b>perceber, dar-se conta</b> de algo.", mod: 'falsos-cognatos' },
    { t: "<b>'Actually'</b> não é “atualmente”. Significa <b>na verdade</b>.", mod: 'falsos-cognatos' },
    { t: "Idade em inglês usa o verbo 'to be': <b>“She is 30 years old”</b>, nunca 'she has'.", mod: 'erros-comuns' },
    { t: "<b>'Costume'</b> não é “costume”. É <b>fantasia</b> de festa. 'Costume' se diz 'habit'.", mod: 'falsos-cognatos' },
    { t: "<b>'Cost an arm and a leg'</b> quer dizer <b>ser muito caro</b> — sem partes do corpo envolvidas.", mod: 'idiomas' }
  ];
  var MAGIC_IDX = Math.floor(Math.random() * MAGIC_FACTS.length);
  function renderMagicMoment() {
    var el = $('#magicMoment');
    if (!el) return;
    if (S.unlocked) { el.innerHTML = ''; return; }
    var f = MAGIC_FACTS[MAGIC_IDX];
    el.innerHTML = '<button class="magic" type="button" data-magic-id="' + f.mod + '">' +
      '<span class="magic-eyebrow">' + icon('chat-circle-text') + '<span>Você sabia?</span></span>' +
      '<p class="magic-fact">' + f.t + '</p>' +
      '<p class="magic-sub">É esse tipo de pegadinha que o EnglishDuo corrige em segundos, com explicação em português.</p>' +
      '<span class="magic-cta">Testar meu inglês agora' + icon('arrow-right') + '</span></button>';
  }

  function firstName() { return S.me ? String(S.me.name || '').split(' ')[0] : ''; }

  function renderHero() {
    var el = $('#hero');
    if (S.unlocked) {
      var t = totals();
      var h = t.answered ? 'Continue de onde parou, ' + esc(firstName()) + '.' : 'Bem-vindo, ' + esc(firstName()) + '.';
      var sub = t.answered
        ? 'Você respondeu ' + t.answered + ' ' + plural(t.answered, 'questão', 'questões') + ' e acertou ' + t.correct + '.'
        : 'Todas as ' + TOTAL + ' questões, as aulas e os materiais estão liberados.';
      el.innerHTML = '<section class="hero"><div class="hero-copy"><h1>' + h + '</h1><p class="lead">' + sub + '</p></div>' +
        (t.answered ? '<div class="allow"><p class="bignum">' + t.pct + '%</p><p>de acerto</p></div>' : '') + '</section>';
      return;
    }
    var used = freeUsed(), total = freeTotal(), done = used >= total;
    var head = done ? 'Seu teste grátis terminou.' : 'Faça ' + total + ' questões de graça.';
    var lead = done ? 'Libere as ' + TOTAL + ' questões e as aulas gravadas para continuar.' : 'Depois libere as ' + TOTAL + ' questões e as aulas gravadas.';
    var ticks = '';
    for (var i = 0; i < total; i++) ticks += '<span class="tick' + (i < used ? ' on' : '') + '"></span>';
    el.innerHTML = '<section class="hero"><div class="hero-copy"><h1>' + head + '</h1><p class="lead">' + lead + '</p>' +
      '<div class="hero-cta"><button class="btn btn-red" type="button" data-pay="' + (done ? 'limit' : 'hero') + '">Liberar acesso</button></div></div>' +
      '<div class="allow"><div class="ticks" role="img" aria-label="' + used + ' de ' + total + ' questões grátis usadas">' + ticks + '</div><p>' + used + ' de ' + total + ' usadas</p></div></section>';
  }

  function renderChips() {
    var cats = ['all', 'grammar', 'vocabulary', 'skills', 'exams'];
    $('#chips').innerHTML = cats.map(function (c) {
      var n = c === 'all' ? MODULES.length : MODULES.filter(function (m) { return m.cat === c; }).length;
      return '<button class="chip' + (S.filter === c ? ' on' : '') + '" type="button" data-f="' + c + '" aria-pressed="' + (S.filter === c) + '">' + CAT[c] + '<span class="chip-n">' + n + '</span></button>';
    }).join('');
  }

  function tileHTML(m, i) {
    var st = S.unlocked ? 'open' : (canOpen(m) ? 'free' : 'locked');
    var s = modStats(m), total = m.total;
    var done = S.unlocked && s.answered === total && total > 0;
    var state = '';
    if (st === 'free') state = '<span class="tag">' + m.q.length + ' grátis</span>';
    else if (st === 'locked') state = '<span class="tile-state">' + icon('lock-fill') + '</span>';
    else if (done) state = '<span class="tile-state done">' + icon('check-circle-fill') + '</span>';
    var meta2 = (S.unlocked && s.answered) ? s.answered + ' de ' + total + ' respondidas' : total + ' questões';
    return '<button class="tile tile-' + st + '" type="button" data-id="' + esc(m.id) + '" style="--i:' + i + '"' +
      ' aria-label="' + esc(m.name) + (st === 'locked' ? ', bloqueado' : '') + '">' +
      '<span class="tile-top"><span class="tile-ico">' + icon(m.icon) + '</span>' + state + '</span>' +
      '<span class="tile-name">' + esc(m.name) + '</span>' +
      '<span class="tile-meta">' + LEVEL[m.lvl] + '</span>' +
      '<span class="tile-meta">' + meta2 + '</span></button>';
  }

  function renderGrid() {
    if (!S.ready) return;
    renderCourseCard();
    var q = fold(S.q.trim());
    var list = MODULES.filter(function (m) {
      if (S.filter !== 'all' && m.cat !== S.filter) return false;
      if (!q) return true;
      return fold(m.name + ' ' + m.desc + ' ' + CAT[m.cat]).indexOf(q) !== -1;
    });
    $('#grid').innerHTML = list.map(tileHTML).join('');
    var empty = $('#empty');
    if (!list.length) {
      empty.hidden = false;
      empty.innerHTML = '<h2>Nenhum módulo encontrado.</h2><p>Tente outro termo ou limpe a busca.</p><button class="btn btn-line" type="button" data-act="clear">Limpar busca</button>';
    } else empty.hidden = true;
  }

  function renderSkeleton() {
    $('#hero').innerHTML = '<div class="sk sk-hero" aria-hidden="true"></div>';
    $('#chips').innerHTML = '';
    $('#courseCard').innerHTML = '';
    var t = '';
    for (var i = 0; i < 8; i++) t += '<div class="sk sk-tile" aria-hidden="true"></div>';
    $('#grid').innerHTML = t;
    $('#grid').setAttribute('aria-busy', 'true');
  }
  function renderBootError(msg) {
    $('#hero').innerHTML = '';
    $('#grid').innerHTML = '';
    var empty = $('#empty');
    empty.hidden = false;
    empty.innerHTML = '<div class="boot-err"><h2>Não foi possível carregar.</h2><p>' + esc(msg || 'Verifique sua conexão.') + '</p><button class="btn btn-ink" type="button" data-act="retry">Tentar de novo</button></div>';
  }

  function refreshHome() {
    if (!S.ready) return;
    $('#grid').removeAttribute('aria-busy');
    renderHero(); renderMagicMoment(); renderChips(); renderGrid();
  }
  function refreshAll() {
    refreshHome(); renderTop();
    if (S.view === 'progress') renderProgress();
    if (S.view === 'courses') renderCourses();
    if (S.view === 'quiz') {
      var m = modById(S.mod);
      if (!m || !canOpen(m)) showHome();
      else { if (!pageAllowed(m, S.page)) S.page = 1; renderQuiz(); }
    }
  }

  var VIEWS = ['home', 'quiz', 'progress', 'courses', 'lesson'];
  function setView(v) {
    var prev = S.view;
    S.view = v;
    VIEWS.forEach(function (n) { $('#' + n + 'View').hidden = n !== v; });
    document.body.setAttribute('data-view', v);
    renderTop(); renderTabs();
    if (prev === 'lesson' && v !== 'lesson') stopPlayer();
    if (v !== 'lesson') chatStop();
    window.scrollTo(0, 0);
  }
  function renderTop() {
    var slot = $('#topSlot');
    if (S.unlocked) slot.innerHTML = '<button class="tag tag-ink" type="button" data-pay="account">' + icon('seal-check-fill') + esc(firstName() || 'Aluno') + '</button>';
    else if (S.ready && S.view === 'progress') slot.innerHTML = '<button class="btn btn-red btn-sm" type="button" data-pay="top">Liberar acesso</button>';
    else slot.innerHTML = '';
  }
  function renderTabs() {
    $$('.tab').forEach(function (t) {
      var k = t.dataset.tab;
      var on = (k === 'home' && (S.view === 'home' || S.view === 'quiz')) || (k === 'progress' && S.view === 'progress') ||
        (k === 'courses' && (S.view === 'courses' || S.view === 'lesson'));
      t.classList.toggle('on', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
  }
  function pushHist() {
    if (S.pushed) return;
    try { history.pushState({ ed: 1 }, ''); S.pushed = true; } catch (e) { S.pushed = false; }
  }
  function goHome() {
    if (S.pushed) {
      S.pushed = false;
      try { history.back(); } catch (e) { }
      setTimeout(function () { if (S.view !== 'home') showHome(); }, 160);
      return;
    }
    showHome();
  }
  function showHome() { S.pushed = false; refreshHome(); setView('home'); }
  window.addEventListener('popstate', function () {
    if (PV.open) { closePdf(true); return; }
    if (S.view === 'lesson') { S.pushed = false; showCourses(); return; }
    if (S.view !== 'home') { S.pushed = false; refreshHome(); setView('home'); }
  });

  function openModule(id) {
    var m = modById(id);
    if (!m) return;
    if (!canOpen(m)) { openPay('module'); return; }
    showQuiz(id, 1, true);
  }

  function showQuiz(id, page, push) {
    var m = modById(id);
    if (!m) return;
    if (!pageAllowed(m, page)) { openPay('page'); return; }
    S.mod = id; S.page = page;
    renderQuiz();
    if (push) pushHist();
    setView('quiz');
  }

  function pageDone(m, p) {
    var start = (p - 1) * PER, end = pageEnd(m, p);
    for (var i = start; i < end; i++) if (S.progress[m.q[i].id] === undefined) return false;
    return true;
  }

  function pagesHTML(m, page) {
    var pages = pageCount(m), pg = '';
    for (var p = 1; p <= pages; p++) {
      var locked = !pageAllowed(m, p);
      var cls = 'pg' + (p === page ? ' cur' : '') + (locked ? ' locked' : '') + (!locked && p !== page && pageDone(m, p) ? ' done' : '');
      pg += '<button class="' + cls + '" type="button" data-p="' + p + '" aria-label="Página ' + p + (locked ? ', bloqueada' : '') + '"' + (p === page ? ' aria-current="true"' : '') + '>' + (locked ? icon('lock-fill') : p) + '</button>';
    }
    return pg;
  }
  function qbarRight() { return S.unlocked ? '' : '<button class="btn btn-red btn-sm btn-cta" type="button" data-pay="top" aria-label="Liberar acesso"><span class="cta-txt">Liberar acesso</span><span class="cta-ico">' + icon('lock-open') + '</span></button>'; }

  function renderQuiz() {
    var m = modById(S.mod), page = S.page, start = (page - 1) * PER;
    var items = m.q.slice(start, pageEnd(m, page));
    $('#quizView').innerHTML =
      '<div class="qbar"><button class="iconbtn" type="button" id="qBack" aria-label="Voltar aos módulos">' + icon('arrow-left') + '</button>' +
      '<div class="qtitle"><h2>' + esc(m.name) + '</h2><p id="qSub"></p></div><span id="qRight">' + qbarRight() + '</span></div>' +
      '<nav class="pages" id="qPages" aria-label="Páginas do módulo">' + pagesHTML(m, page) + '</nav>' +
      '<div id="qlist">' + items.map(function (q, i) { return qHTML(q, start + i, i); }).join('') + '</div>' +
      lockTailHTML(m, page) + '<div id="scoreSlot"></div>';
    updateQSub();
    centerPage();
  }

  function lockTailHTML(m, page) {
    var full = Math.min(page * PER, m.total), hidden = full - pageEnd(m, page);
    if (hidden <= 0) return '';
    return '<button class="q-lock" id="qTail" type="button" data-pay="page">' + icon('lock-fill') + '<span>Mais ' + hidden + ' ' + plural(hidden, 'questão desta página faz', 'questões desta página fazem') + ' parte do acesso completo.</span></button>';
  }

  function qHTML(q, abs, i) {
    var opts = q.o.map(function (t, k) {
      return '<button type="button" class="opt" role="radio" aria-checked="false" data-k="' + k + '"><span class="key">' + 'ABCD'.charAt(k) + '</span><span class="otext">' + esc(t) + '</span><span class="mark-ico"></span></button>';
    }).join('');
    return '<article class="q" data-i="' + i + '" data-abs="' + abs + '">' +
      '<div class="q-head"><span class="q-num">Questão ' + (abs + 1) + '</span><span class="q-res"></span></div>' +
      '<h3 class="q-text"><button type="button" class="q-speak" data-speak="' + esc(q.t) + '" aria-label="Ouvir a pergunta">' + icon('speaker-high') + '</button><span class="q-text-t">' + esc(q.t) + '</span></h3>' +
      '<div class="opts" role="radiogroup" aria-label="Alternativas">' + opts + '</div>' +
      '<button type="button" class="btn btn-ink btn-block q-check" disabled>Verificar resposta</button>' +
      '<div class="q-expl" hidden></div></article>';
  }

  var VOICE = null;
  function pickVoice() {
    try {
      var vs = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      if (!vs || !vs.length) return null;
      var en = vs.filter(function (v) { return /^en/i.test(v.lang); });
      var pref = en.find(function (v) { return /female|samantha|zira|google us english/i.test(v.name); });
      return pref || en[0] || vs[0];
    } catch (e) { return null; }
  }
  if (window.speechSynthesis) {
    VOICE = pickVoice();
    window.speechSynthesis.onvoiceschanged = function () { VOICE = pickVoice(); };
  }
  function speak(text, btn) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      if (VOICE) u.voice = VOICE;
      u.rate = 0.92; u.pitch = 1.08;
      if (btn) {
        u.onstart = function () { btn.classList.add('speaking'); };
        u.onend = function () { btn.classList.remove('speaking'); };
        u.onerror = function () { btn.classList.remove('speaking'); };
      }
      window.speechSynthesis.speak(u);
    } catch (e) { }
  }

  function centerPage() {
    var bar = $('#qPages'), cur = bar && $('.pg.cur', bar);
    if (!cur) return;
    bar.scrollLeft = Math.max(0, cur.offsetLeft - (bar.clientWidth - cur.offsetWidth) / 2);
  }
  function updateQSub() {
    var el = $('#qSub'); if (!el) return;
    el.textContent = 'Página ' + S.page + ' de ' + pageCount(modById(S.mod));
  }

  function selectOpt(opt) {
    var qEl = opt.closest('.q');
    if (qEl.classList.contains('done')) return;
    $$('.opt', qEl).forEach(function (o) { o.classList.remove('sel'); o.setAttribute('aria-checked', 'false'); });
    opt.classList.add('sel'); opt.setAttribute('aria-checked', 'true');
    $('.q-check', qEl).disabled = false;
  }

  function checkQ(qEl) {
    var sel = $('.opt.sel', qEl);
    if (!sel || qEl.classList.contains('done')) return;
    var m = modById(S.mod), q = m.q[+qEl.dataset.abs];
    var k = +sel.dataset.k, ok = k === q.a;
    qEl.classList.add('done', ok ? 'ok' : 'bad');
    $$('.opt', qEl).forEach(function (o) {
      var ko = +o.dataset.k;
      o.classList.remove('sel');
      o.setAttribute('aria-disabled', 'true');
      var mark = $('.mark-ico', o);
      if (ko === q.a) { o.classList.add('right'); mark.innerHTML = icon('check-circle-fill'); }
      else if (ko === k) { o.classList.add('wrong'); mark.innerHTML = icon('x-circle-fill'); }
      else o.classList.add('dim');
    });
    var res = $('.q-res', qEl);
    res.className = 'q-res ' + (ok ? 'ok' : 'bad');
    res.innerHTML = icon(ok ? 'check-circle-fill' : 'x-circle-fill') + (ok ? 'Resposta correta' : 'Resposta incorreta');
    var ex = $('.q-expl', qEl);
    ex.hidden = false;
    ex.innerHTML = '<strong>Explicação</strong>' + esc(q.e);
    var nextQ = qEl.nextElementSibling;
    if (nextQ && nextQ.classList.contains('q')) {
      var nb = document.createElement('button');
      nb.type = 'button'; nb.className = 'btn btn-line btn-block q-next'; nb.setAttribute('data-act', 'nextq');
      nb.innerHTML = 'Próxima questão' + icon('arrow-down');
      qEl.appendChild(nb);
    }
    try { if (navigator.vibrate) navigator.vibrate(ok ? 12 : [18, 40, 18]); } catch (e) { }
    speak(ok ? 'Correct! ' + q.t : 'Not quite. ' + q.t, null);
    setTimeout(function () { try { ex.scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { } }, 80);
    S.progress[q.id] = ok ? 1 : 0;
    saveProgress();
    updateQSub();
    if ($$('#qlist .q').every(function (e) { return e.classList.contains('done'); })) showScore();
  }

  function showScore() {
    var m = modById(S.mod), qs = $$('#qlist .q'), n = qs.length;
    var c = qs.filter(function (e) { return e.classList.contains('ok'); }).length;
    var pages = pageCount(m), next = S.page + 1, hasNext = next <= pages, allowed = hasNext && pageAllowed(m, next);
    var msg = c === n ? 'Página perfeita.' : c / n >= 0.7 ? 'Muito bem, continue assim.' : c / n >= 0.5 ? 'Bom caminho. Revise as explicações e tente de novo.' : 'Sem pressa. Leia as explicações e refaça a página.';
    var t = totals();
    var note = '', actions;
    if (allowed) {
      actions = '<button class="btn btn-ink" type="button" data-act="next">Próxima página</button><button class="btn btn-line" type="button" data-act="redo">Refazer página</button>';
    } else if (hasNext) {
      note = '<p class="score-note">Você já acertou ' + t.correct + ' ' + plural(t.correct, 'questão', 'questões') + ' e corrigiu erros que a maioria dos brasileiros comete. O teste grátis deste módulo termina aqui — libere o acesso completo para continuar evoluindo sem parar.</p>';
      actions = '<button class="btn btn-red" type="button" data-pay="page">Liberar acesso</button><button class="btn btn-line" type="button" data-act="home">Voltar aos módulos</button>';
    } else {
      actions = '<button class="btn btn-ink" type="button" data-act="home">Voltar aos módulos</button><button class="btn btn-line" type="button" data-act="redo">Refazer página</button>';
    }
    $('#scoreSlot').innerHTML = '<section class="score" aria-live="polite"><p class="score-num">' + c + '/' + n + '</p><p class="score-msg">' + msg + '</p>' + note + '<div class="score-actions">' + actions + '</div></section>';
    var slot = $('#scoreSlot');
    setTimeout(function () { slot.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' }); }, 60);
  }

  // ---------- aulas ----------
  function lessonCount() { return LESSON_LIST.length; }
  function previewCount() { return LESSON_LIST.filter(function (l) { return l.preview; }).length; }

  function courseAccessHTML() {
    if (S.unlocked) {
      var seen = LESSON_LIST.filter(function (l) { return S.seen[l.id]; }).length;
      return '<div class="hello">' + icon('users-three') + '<div><strong>Área de membros</strong><span>' + lessonCount() + ' aulas e materiais em PDF · ' + seen + ' ' + plural(seen, 'aula aberta', 'aulas abertas') + '</span></div></div>';
    }
    return '<button class="video-card locked" type="button" data-pay="video" aria-label="Assistir às aulas, bloqueado">' +
      '<span class="video-ico">' + icon('play-circle') + '</span>' +
      '<span class="video-card-body"><span class="video-card-title">Assistir às aulas</span><span class="video-card-sub">' + (previewCount() ? previewCount() + ' ' + plural(previewCount(), 'aula com prévia grátis', 'aulas com prévia grátis') + ' · vídeos no acesso completo' : 'Disponível no acesso completo') + '</span></span>' +
      '<span class="video-state">' + icon('lock-fill') + '</span></button>';
  }

  function lessonRowHTML(l) {
    var kind = l.kind === 'pdf' ? 'Material em PDF' : 'Vídeo-aula';
    if ((S.unlocked || l.preview) && l.pdfs && l.pdfs.length && l.kind !== 'pdf') kind += ' + PDF';
    if (!S.unlocked && l.preview) {
      return '<li><button class="lesson-row" type="button" data-lesson="' + esc(l.id) + '"><span class="lesson-n">' + l.i + '</span><span class="lesson-t">' + esc(l.title) + '<small>Prévia grátis · ' + kind + '</small></span><span class="lesson-i">' + icon('arrow-right') + '</span></button></li>';
    }
    if (!S.unlocked) {
      return '<li><button class="lesson-row locked" type="button" data-pay="video"><span class="lesson-n">' + l.i + '</span><span class="lesson-t">' + esc(l.title) + '<small>' + kind + '</small></span><span class="lesson-i">' + icon('lock-fill') + '</span></button></li>';
    }
    return '<li><button class="lesson-row' + (S.seen[l.id] ? ' seen' : '') + '" type="button" data-lesson="' + esc(l.id) + '"><span class="lesson-n">' + l.i + '</span><span class="lesson-t">' + esc(l.title) + '<small>' + kind + '</small></span><span class="lesson-i">' + icon(l.kind === 'pdf' ? 'file-pdf' : 'play-circle') + '</span></button></li>';
  }

  var openCourse = null;
  function renderCourses() {
    var items = COURSE.map(function (c) {
      var meta = '<span class="c-meta"><span>Módulo ' + c.n + '</span>' + (c.level ? '<span class="tag-soft">' + esc(c.level) + '</span>' : '') + '<span>' + c.lessons.length + ' ' + plural(c.lessons.length, 'aula', 'aulas') + '</span></span>';
      var goal = c.goal ? '<p class="c-goal">' + esc(c.goal) + '</p>' : '';
      var list = '<ul class="lessons">' + c.lessons.map(lessonRowHTML).join('') + '</ul>';
      return '<details class="course" data-n="' + c.n + '"' + (openCourse === c.n ? ' open' : '') + '><summary><span class="c-head">' + meta + '<strong class="c-title">' + esc(c.title) + '</strong></span><span class="c-caret">' + icon('caret-down') + '</span></summary><div class="c-body">' + goal + list + '</div></details>';
    }).join('');
    $('#coursesView').innerHTML =
      '<section class="pv-head"><h1>Aulas gravadas</h1><p class="lead">Sete módulos gravados, do primeiro contato com o inglês ao inglês para negócios.</p>' + courseAccessHTML() + '</section>' +
      '<h2 class="c-h2">Estrutura do curso</h2><div class="courses">' + items + '</div>';
  }

  function renderCourseCard() {
    var el = $('#courseCard');
    if (S.q.trim() || S.filter !== 'all') { el.innerHTML = ''; return; }
    el.innerHTML = '<button class="video-card course-card" type="button" data-act="courses">' +
      '<span class="video-ico">' + icon('play-circle') + '</span>' +
      '<span class="video-card-body"><span class="video-card-title">Aulas gravadas</span><span class="video-card-sub">' + COURSE.length + ' módulos · ' + lessonCount() + ' aulas' + (S.unlocked ? ' · liberadas' : '') + '</span></span>' +
      '<span class="video-state">' + icon('arrow-right') + '</span></button>';
  }

  function showCourses() {
    if (!S.ready) return;
    renderCourses();
    if (S.view === 'home') pushHist();
    setView('courses');
  }

  var playerReq = 0;
  function playerFull() {
    var w = $('#playerWrap'); if (!w) return;
    var fake = function () { w.classList.add('fs'); document.body.classList.add('lock'); };
    var go = w.requestFullscreen || w.webkitRequestFullscreen;
    if (!go) { fake(); return; }
    try {
      var r = go.call(w);
      var lock = function () { try { screen.orientation.lock('landscape').catch(function () {}); } catch (e) { } };
      if (r && r.then) r.then(lock, fake); else lock();
    } catch (e) { fake(); }
  }
  function playerExit() {
    var w = $('#playerWrap');
    if (w) w.classList.remove('fs');
    document.body.classList.remove('lock');
    try { if (document.fullscreenElement) document.exitFullscreen(); else if (document.webkitFullscreenElement) document.webkitExitFullscreen(); } catch (e) { }
    try { screen.orientation.unlock(); } catch (e) { }
  }
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement) { try { screen.orientation.unlock(); } catch (e) { } } });

  function stopPlayer() {
    if ($('#playerWrap.fs') || document.fullscreenElement) playerExit();
    playerReq++;
    var f = $('#lessonView iframe');
    if (f) { f.src = 'about:blank'; f.remove(); }
  }

  function showLesson(id) {
    var l = LESSONS[id];
    if (!l) return;
    var pv = !S.unlocked;
    if (pv && !l.preview) { openPay('video'); return; }
    stopPlayer();
    S.lesson = id;
    openCourse = l.n;
    S.seen[id] = 1; sset('ed.seen', JSON.stringify(S.seen));
    var c = COURSE.filter(function (x) { return x.n === l.n; })[0];
    var idx = LESSON_LIST.indexOf(l), prev = LESSON_LIST[idx - 1], next = LESSON_LIST[idx + 1];

    var player;
    if (pv && l.kind !== 'pdf') {
      player = '<div class="player player-pdf">' + icon('lock-fill') + '<strong>Vídeo disponível no acesso completo</strong><span>Esta é uma prévia da aula. Libere o acesso para assistir.</span><button class="btn btn-red btn-sm" type="button" data-pay="video">Liberar acesso</button></div>';
    } else if (l.kind === 'pdf') {
      player = '<div class="player player-pdf">' + icon('file-pdf') + '<strong>Esta aula é um material em PDF</strong><span>Abra o material abaixo para estudar.</span></div>';
    } else {
      player = '<div class="player-wrap"><div class="player" id="player"><div class="player-load"><span class="spin"></span><span>Carregando vídeo…</span></div></div></div>';
    }
    var mats = (l.pdfs || []).map(function (p) {
      return '<div class="mat"><button class="mat-open" type="button" data-pdfview="' + esc(p.id) + '" data-title="' + esc(p.name) + '" data-sub="' + esc(l.title) + '">' +
        '<span class="mat-ico">' + icon('file-pdf') + '</span><span class="mat-body"><strong>' + esc(p.name) + '</strong><span>Toque para ver no site</span></span></button>' +
        (pv ? '' : '<button class="mat-dl" type="button" data-pdfdl="' + esc(p.id) + '" aria-label="Baixar ' + esc(p.name) + '">' + icon('download-simple') + '</button>') + '</div>';
    }).join('');
    var desc = l.desc || (c && c.goal) || '';

    $('#lessonView').innerHTML =
      '<div class="qbar"><button class="iconbtn" type="button" data-act="courses-back" aria-label="Voltar às aulas">' + icon('arrow-left') + '</button>' +
      '<div class="qtitle"><h2>' + esc(c ? c.title : 'Aula') + '</h2><p>Módulo ' + l.n + ' · Aula ' + l.i + '</p></div></div>' +
      '<div class="lv-head"><h1>' + esc(l.title) + '</h1></div>' + player +
      '<section class="lv-sec"><h2>Sobre a aula</h2><p>' + (desc ? esc(desc) : 'Assista à aula e use o material de apoio para praticar.') + '</p></section>' +
      '<section class="lv-sec"><h2>Material de apoio</h2>' + (mats ? '<div class="mats">' + mats + '</div>' : '<p class="none">Esta aula não tem material em PDF.</p>') + '</section>' +
      (pv ? '<section class="lv-sec"><h2>Dúvidas da aula</h2><p class="none">O chat da turma é do acesso completo.</p></section>' : chatHTML()) +
      '<nav class="lv-nav">' +
      (prev ? '<button class="btn btn-line" type="button" data-lesson="' + esc(prev.id) + '">' + icon('caret-left') + '<span>Anterior</span></button>' : '<span></span>') +
      (next ? '<button class="btn btn-ink" type="button" data-lesson="' + esc(next.id) + '"><span>Próxima aula</span>' + icon('caret-right') + '</button>' : '<span></span>') +
      '</nav>';

    if (S.view !== 'lesson') pushHist();
    setView('lesson');
    if (!pv && l.kind !== 'pdf') loadVideo(l);
    if (!pv) chatStart(l.id);
  }

  function playerFail(box, title, sub) {
    box.classList.remove('ready');
    box.innerHTML = '<div class="player-fail">' + icon('video-camera-slash') + '<strong>' + esc(title) + '</strong><span>' + esc(sub) + '</span></div>';
  }

  function loadVideo(l) {
    var my = ++playerReq;
    var box = $('#player');
    api('/api/video?l=' + encodeURIComponent(l.id)).then(function (d) {
      if (my !== playerReq || !box.isConnected) return;
      if (!d.src) { playerFail(box, 'Falha ao carregar vídeo', 'Este vídeo não está disponível no momento.'); return; }
      var f = document.createElement('iframe');
      f.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('referrerpolicy', 'no-referrer');
      f.setAttribute('title', l.title);
      var shield = document.createElement('div');
      shield.className = 'player-shield';
      var to = setTimeout(function () { if (my === playerReq && !box.classList.contains('ready')) playerFail(box, 'Falha ao carregar vídeo', 'Verifique sua internet e tente de novo.'); }, 25000);
      f.addEventListener('load', function () { clearTimeout(to); if (my === playerReq) box.classList.add('ready'); });
      box.appendChild(f);
      box.appendChild(shield);
      f.src = d.src;
    }).catch(function (e) {
      if (my !== playerReq) return;
      if (e.status === 401) { sessionLost(); return; }
      playerFail(box, 'Falha ao carregar vídeo', e.message);
    });
  }

  // ---------- PDF: ver no site e baixar ----------
  var PDFS = {};
  function fetchPdf(id) {
    if (PDFS[id]) return Promise.resolve(PDFS[id]);
    return fetch('/api/material?id=' + encodeURIComponent(id), { credentials: 'same-origin', headers: authHeaders({}) }).then(function (r) {
      if (r.status === 401) { var e = new Error('Sessão expirada.'); e.status = 401; throw e; }
      if (!r.ok) throw new Error('Não foi possível abrir o material.');
      var m = /filename="([^"]+)"/.exec(r.headers.get('Content-Disposition') || '');
      return r.arrayBuffer().then(function (buf) { PDFS[id] = { buf: buf, name: m ? m[1] : 'material.pdf' }; return PDFS[id]; });
    }, function () { throw new Error('Sem conexão. Tente de novo.'); });
  }
  function savePdf(x) {
    var url = URL.createObjectURL(new Blob([x.buf], { type: 'application/pdf' }));
    var a = document.createElement('a');
    a.href = url; a.download = x.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    toast('Download iniciado.');
  }
  function downloadPdf(btn, id) {
    if (btn.classList.contains('busy')) return;
    btn.classList.add('busy');
    fetchPdf(id).then(savePdf).catch(function (e) {
      if (e.status === 401) sessionLost(); else toast(e.message);
    }).then(function () { btn.classList.remove('busy'); });
  }

  var pdfLib = null;
  function loadPdfJs() {
    if (pdfLib) return pdfLib;
    pdfLib = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = '/vendor/pdfjs/pdf.min.js';
      s.onload = function () {
        if (!window.pdfjsLib) { rej(new Error('Leitor de PDF indisponível.')); return; }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.min.js';
        res(window.pdfjsLib);
      };
      s.onerror = function () { pdfLib = null; rej(new Error('Não foi possível abrir o leitor de PDF.')); };
      document.head.appendChild(s);
    });
    return pdfLib;
  }

  var PV = { id: null, doc: null, zoom: 1, job: 0, pushed: false, open: false };
  function pdfMsg(html) { $('#pdfBody').innerHTML = '<div class="pdfv-msg">' + html + '</div>'; }
  function openPdf(id, title, sub) {
    PV.id = id; PV.doc = null; PV.zoom = 1; PV.open = true;
    $('#pdfTitle').textContent = title || 'Material';
    $('#pdfInfo').textContent = sub || '';
    $('#pdfZoom').textContent = '100%';
    pdfMsg('<span class="spin"></span><span>Abrindo material…</span>');
    $('#pdfLayer').hidden = false;
    document.body.classList.add('lock');
    try { history.pushState({ pdf: 1 }, ''); PV.pushed = true; } catch (e) { PV.pushed = false; }
    setTimeout(function () { try { $('#pdfClose').focus({ preventScroll: true }); } catch (e) { } }, 30);
    var job = ++PV.job;
    Promise.all([loadPdfJs(), fetchPdf(id)]).then(function (r) {
      return r[0].getDocument({ data: r[1].buf.slice(0), isEvalSupported: false }).promise;
    }).then(function (doc) {
      if (job !== PV.job) return;
      PV.doc = doc;
      $('#pdfInfo').textContent = (sub ? sub + ' · ' : '') + doc.numPages + ' ' + plural(doc.numPages, 'página', 'páginas');
      renderPdf();
    }).catch(function (e) {
      if (job !== PV.job) return;
      if (e.status === 401) { closePdf(); sessionLost(); return; }
      pdfMsg(icon('warning-circle') + '<span>' + esc(e.message || 'Não foi possível abrir o material.') + '</span><button class="btn btn-line btn-sm" type="button" data-pdfv="retry">Tentar de novo</button>');
    });
  }
  function renderPdf() {
    var doc = PV.doc; if (!doc) return;
    var job = ++PV.job, body = $('#pdfBody');
    var avail = Math.min(body.clientWidth - 24, 860);
    var width = Math.round(avail * PV.zoom);
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    body.innerHTML = '';
    var pages = [];
    for (var i = 1; i <= doc.numPages; i++) {
      var w = document.createElement('div');
      w.className = 'pdfv-page';
      w.style.width = width + 'px';
      w.innerHTML = '<span class="spin"></span>';
      body.appendChild(w);
      pages.push(w);
    }
    var n = 0;
    (function next() {
      if (job !== PV.job || n >= doc.numPages) return;
      var idx = ++n;
      doc.getPage(idx).then(function (page) {
        if (job !== PV.job) return;
        var v1 = page.getViewport({ scale: 1 });
        var vp = page.getViewport({ scale: (width / v1.width) * dpr });
        var cv = document.createElement('canvas');
        cv.width = Math.floor(vp.width); cv.height = Math.floor(vp.height);
        cv.style.width = width + 'px'; cv.style.height = Math.floor(vp.height / dpr) + 'px';
        var box = pages[idx - 1];
        box.style.height = cv.style.height;
        return page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise.then(function () {
          if (job !== PV.job) return;
          box.innerHTML = ''; box.style.height = ''; box.appendChild(cv);
        });
      }).then(next, next);
    })();
  }
  function zoomPdf(d) {
    if (!PV.doc) return;
    var z = Math.max(1, Math.min(3, Math.round((PV.zoom + d) * 100) / 100));
    if (z === PV.zoom) return;
    var body = $('#pdfBody'), ratio = body.scrollTop / Math.max(1, body.scrollHeight);
    PV.zoom = z; renderPdf();
    requestAnimationFrame(function () { body.scrollTop = ratio * body.scrollHeight; });
    $('#pdfZoom').textContent = Math.round(z * 100) + '%';
  }
  function closePdf(fromPop) {
    if (!PV.open) return;
    PV.open = false; PV.job++; PV.doc = null;
    $('#pdfLayer').hidden = true;
    $('#pdfBody').innerHTML = '';
    document.body.classList.remove('lock');
    if (PV.pushed && !fromPop) { try { history.back(); } catch (e) { } }
    PV.pushed = false;
  }
  var pdfResizeT;
  window.addEventListener('resize', function () { if (PV.open && PV.doc) { clearTimeout(pdfResizeT); pdfResizeT = setTimeout(renderPdf, 250); } });

  // ---------- chat de cada aula ----------
  var CH = { timer: null, last: '', loaded: false, sending: false, l: null };
  function chatHTML() {
    return '<section class="lv-sec lchat-sec"><h2>Dúvidas da aula</h2>' +
      '<p class="lchat-sub">Converse com a turma sobre esta aula. Seja gentil: mensagens ofensivas são bloqueadas.</p>' +
      '<div class="lchat"><div class="chat-list" id="chatList" aria-live="polite"><div class="loadbox"><span class="spin"></span><span>Carregando mensagens…</span></div></div>' +
      '<form class="chat-form" id="chatForm" autocomplete="off"><textarea id="chatInput" rows="1" maxlength="300" placeholder="Escreva sua dúvida" aria-label="Mensagem"></textarea>' +
      '<button class="btn btn-red" type="submit" id="chatSend" aria-label="Enviar">' + icon('paper-plane-right') + '</button></form>' +
      '<p class="chat-err" id="chatErr" role="alert" hidden></p></div></section>';
  }
  function msgHTML(m) {
    return '<div class="msg' + (m.me ? ' me' : '') + (m.pending ? ' pending' : '') + '" data-id="' + esc(m.id) + '">' +
      (m.me ? '' : '<span class="msg-n">' + esc(m.n) + '</span>') +
      '<div class="msg-b">' + esc(m.t) + '</div><span class="msg-t">' + (m.pending ? 'Enviando…' : fmtTime(m.ts)) + '</span></div>';
  }
  function chatRender(msgs) {
    var list = $('#chatList'); if (!list) return;
    var sig = msgs.length + ':' + (msgs.length ? msgs[msgs.length - 1].id : '');
    if (sig === CH.last && CH.loaded) return;
    var near = list.scrollHeight - list.scrollTop - list.clientHeight < 120 || !CH.loaded;
    CH.last = sig; CH.loaded = true;
    list.innerHTML = msgs.length ? msgs.map(msgHTML).join('') :
      '<div class="chat-empty">' + icon('chat-circle-dots') + '<p>Nenhuma mensagem nesta aula ainda.<br>Tire a primeira dúvida!</p></div>';
    if (near) list.scrollTop = list.scrollHeight;
  }
  function chatPoll() {
    var l = CH.l;
    if (S.view !== 'lesson' || document.hidden || !S.me || !l) return;
    api('/api/chat?l=' + encodeURIComponent(l)).then(function (d) { if (l === CH.l) chatRender(d.msgs || []); }).catch(function (e) {
      if (e.status === 401) { sessionLost(); return; }
      if (!CH.loaded) { var el = $('#chatList'); if (el) el.innerHTML = '<div class="chat-empty"><p>' + esc(e.message) + '</p></div>'; }
    });
  }
  function chatStart(l) {
    chatStop();
    if (!S.me) return;
    CH.l = l; CH.last = ''; CH.loaded = false; CH.sending = false;
    chatPoll();
    CH.timer = setInterval(chatPoll, 8000);
  }
  function chatStop() { if (CH.timer) clearInterval(CH.timer); CH.timer = null; }
  document.addEventListener('visibilitychange', function () { if (!document.hidden && S.view === 'lesson') chatPoll(); });

  function chatErr(msg) {
    var e = $('#chatErr'); if (!e) return;
    if (!msg) { e.hidden = true; return; }
    e.hidden = false; e.innerHTML = icon('warning-circle') + '<span>' + esc(msg) + '</span>';
  }
  function chatSend() {
    var inp = $('#chatInput'), text = inp.value.trim();
    if (!text || CH.sending || !CH.l) return;
    CH.sending = true;
    chatErr('');
    var list = $('#chatList');
    var empty = $('.chat-empty', list); if (empty) empty.remove();
    var tmp = { id: 'tmp', n: S.me.name, t: text, ts: Date.now(), me: true, pending: true };
    list.insertAdjacentHTML('beforeend', msgHTML(tmp));
    list.scrollTop = list.scrollHeight;
    inp.value = ''; inp.style.height = '';
    $('#chatSend').classList.add('loading');
    api('/api/chat', { method: 'POST', body: { l: CH.l, text: text } }).then(function () {
      CH.last = ''; chatPoll();
    }).catch(function (e) {
      var p = $('.msg[data-id="tmp"]', list); if (p) p.remove();
      if (e.status === 401) { sessionLost(); return; }
      inp.value = text;
      chatErr(e.message);
    }).then(function () { CH.sending = false; var b = $('#chatSend'); if (b) b.classList.remove('loading'); });
  }

  // ---------- progresso ----------
  var resetArmed = false, resetTimer;
  function renderProgress() {
    var t = totals();
    var rows = MODULES.map(function (m) {
      var s = modStats(m), av = canOpen(m) ? available(m) : 0;
      var sub = av ? s.answered + ' de ' + av + ' respondidas' : 'Bloqueado';
      var val = av ? (s.answered ? Math.round(100 * s.correct / s.answered) + '%' : '0%') : icon('lock-fill');
      return '<li class="prow"><span class="prow-ico">' + icon(m.icon) + '</span><div class="prow-main"><strong>' + esc(m.name) + '</strong><span>' + sub + '</span></div><span class="prow-val">' + val + '</span></li>';
    }).join('');
    $('#progressView').innerHTML =
      '<section class="pv-head"><h1>Seu progresso</h1><div class="pv-stat"><p class="bignum">' + t.pct + '%</p><p>de acerto em ' + t.answered + ' ' + plural(t.answered, 'questão respondida', 'questões respondidas') + '</p></div>' +
      (S.unlocked ? '' : '<div><button class="btn btn-red" type="button" data-pay="tab">Liberar acesso</button></div>') + '</section>' +
      '<ul class="prows">' + rows + '</ul>' +
      '<button class="btn btn-line" type="button" id="resetBtn">Zerar progresso</button>';
    resetArmed = false;
  }
  function showProgress() {
    if (!S.ready) return;
    renderProgress();
    if (S.view === 'home') pushHist();
    setView('progress');
  }

  // ---------- camadas ----------
  var lastFocus = null;
  function focusables(root) { return $$('a[href],button:not([disabled]),input:not([disabled]),textarea,[tabindex="0"]', root).filter(function (e) { return e.offsetParent !== null; }); }
  function openLayer(id) {
    var L = $('#' + id);
    lastFocus = document.activeElement;
    L.hidden = false;
    document.body.classList.add('lock');
    requestAnimationFrame(function () {
      L.classList.add('show');
      var f = $('[data-autofocus]', L) || $('.sheet', L);
      try { f.focus({ preventScroll: true }); } catch (e) { }
    });
  }
  function closeLayer(id) {
    var L = $('#' + id);
    L.classList.remove('show');
    setTimeout(function () {
      L.hidden = true;
      if (!document.querySelector('.layer:not([hidden])')) document.body.classList.remove('lock');
      if (lastFocus && lastFocus.focus && document.contains(lastFocus)) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { } }
    }, REDUCED ? 0 : 200);
  }
  document.addEventListener('keydown', function (e) {
    if (PV.open && e.key === 'Escape') { closePdf(); return; }
    var L = $('.layer:not([hidden])');
    if (!L) return;
    if (e.key === 'Escape' && L.id === 'payLayer') { closeLayer('payLayer'); return; }
    if (e.key === 'Escape' && L.id === 'termsLayer') { declineTerms(); return; }
    if (e.key === 'Tab') {
      var f = focusables($('.sheet', L));
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === $('.sheet', L))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var PAY_TITLES = {
    module: 'Este módulo é do acesso completo.',
    page: 'Continue com o acesso completo.',
    limit: 'Seu teste grátis terminou.',
    hero: 'Libere todas as questões.',
    top: 'Libere todas as questões.',
    tab: 'Entre ou libere o acesso.',
    video: 'As aulas gravadas são do acesso completo.'
  };

  function renderPay(reason) {
    var b = $('#payBody');
    if (S.unlocked) {
      var ini = (S.me.name || '?').trim().charAt(0).toUpperCase();
      b.innerHTML = '<h2 id="payTitle">Sua conta</h2>' +
        '<div class="acc"><span class="acc-av" aria-hidden="true">' + esc(ini) + '</span><div><strong>' + esc(S.me.name) + '</strong><span>Chave ' + esc(S.me.key) + '</span></div></div>' +
        '<ul class="perks">' +
        '<li><span class="perk-ico">' + icon('seal-check-fill') + '</span><span>Acesso completo ativo' + (S.me.exp ? ' até ' + fmtDate(S.me.exp) : '') + '</span></li>' +
        '<li><span class="perk-ico">' + icon('chart-bar') + '</span><span>Seu progresso fica salvo na sua conta</span></li></ul>' +
        '<button class="btn btn-ink btn-block" type="button" data-close data-autofocus>Continuar estudando</button>' +
        '<button class="btn-text" type="button" id="logoutBtn">Sair desta conta</button>';
      return;
    }
    var t2 = totals();
    var progressLine = t2.answered
      ? '<p class="lead">Você já acertou <strong>' + t2.correct + '</strong> de <strong>' + t2.answered + '</strong> questões grátis (' + t2.pct + '%). Não perca esse ritmo — libere tudo e continue evoluindo agora.</p>'
      : '<p class="lead">Continue de onde parou, sem limite de questões.</p>';
    b.innerHTML = '<h2 id="payTitle">' + (PAY_TITLES[reason] || PAY_TITLES.hero) + '</h2>' +
      progressLine +
      '<ul class="perks">' +
      '<li><span class="perk-ico">' + icon('list-checks') + '</span><span>' + TOTAL + ' questões em ' + MODULES.length + ' módulos, sem limite</span></li>' +
      '<li><span class="perk-ico">' + icon('play-circle') + '</span><span>' + lessonCount() + ' aulas gravadas direto no site</span></li>' +
      '<li><span class="perk-ico">' + icon('file-pdf') + '</span><span>Material em PDF de cada aula, para ver e baixar</span></li>' +
      '<li><span class="perk-ico">' + icon('chat-circle-dots') + '</span><span>Chat de dúvidas em cada aula</span></li></ul>' +
      (CONFIG.priceLabel ? '<p class="price">' + esc(CONFIG.priceLabel) + '</p>' : '') +
      '<a class="btn btn-red btn-block" id="payGo" data-autofocus href="' + esc(CONFIG.checkoutUrl) + '" target="_blank" rel="noopener noreferrer">Liberar acesso completo agora' + icon('arrow-up-right') + '</a>' +
      '<p class="fine">Pagamento único e seguro. A chave de acesso chega no seu e-mail.</p>' +
      '<div class="redeem"><label for="codeInput">Já pagou? Entre com sua chave</label>' +
      '<p class="help" id="codeHelp">Confira seu e-mail (e a caixa de spam).</p>' +
      '<div class="redeem-row"><input id="codeInput" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ED-XXXX-XXXX-XXXX" aria-describedby="codeHelp codeErr" value="' + esc(preKey) + '">' +
      '<button class="btn btn-line" type="button" id="codeBtn"><span class="btn-label">Entrar</span></button></div>' +
      '<div class="name-step" id="nameStep" hidden><label for="nameInput">Como você se chama?</label>' +
      '<p>Seu nome aparece no chat das aulas e fica salvo neste aparelho.</p>' +
      '<input id="nameInput" type="text" maxlength="40" autocomplete="name" placeholder="Seu nome">' +
      '<button class="btn btn-ink btn-block" type="button" id="nameBtn"><span class="btn-label">Entrar</span></button></div>' +
      '<p class="err" id="codeErr" role="alert" hidden></p></div>';
  }
  function openPay(reason) {
    if (!S.ready) return;
    var go = function () { renderPay(reason); openLayer('payLayer'); };
    go();
  }
  function closePay() { closeLayer('payLayer'); }

  function showCodeError(msg, focusEl) {
    var e = $('#codeErr'), i = focusEl || $('#codeInput');
    if (!e) return;
    e.hidden = false; e.innerHTML = icon('warning-circle') + '<span>' + esc(msg) + '</span>';
    if (i) { i.classList.add('bad'); i.setAttribute('aria-invalid', 'true'); i.focus(); }
  }
  function setBusy(btn, on) { if (!btn) return; btn.classList.toggle('loading', on); btn.disabled = on; }

  function tryCode() {
    if (!termsAccepted()) { requireTerms(tryCode); return; }
    var i = $('#codeInput'), v = i.value.trim();
    var step = $('#nameStep'), nameIn = $('#nameInput');
    var askingName = step && !step.hidden;
    var name = askingName ? nameIn.value.trim() : '';
    if (!v) { showCodeError('Digite a chave que você recebeu.'); return; }
    if (askingName && name.length < 2) { showCodeError('Digite seu nome.', nameIn); return; }
    var btn = askingName ? $('#nameBtn') : $('#codeBtn');
    setBusy(btn, true);
    api('/api/auth?action=login', { method: 'POST', body: { key: v, name: name || undefined, hw: hwSignals() } }).then(function (d) {
      if (d.need === 'name') {
        setBusy(btn, false);
        step.hidden = false;
        $('#codeErr').hidden = true;
        setTimeout(function () { nameIn.focus(); }, 30);
        return;
      }
      if (d.did) sset('ed.did', d.did);
      if (d.st) sset('ed.st', d.st);
      sset('ed.hw', JSON.stringify(hwSignals()));
      return loadContent().then(pullProgress).then(function () {
        setBusy(btn, false);
        closePay();
        refreshAll();
        if (S.view === 'courses') renderCourses();
        preKey = '';
        toast('Bem-vindo, ' + firstName() + '! Acesso liberado.');
      });
    }).catch(function (e) {
      setBusy(btn, false);
      if (e.data && e.data.need === 'name') { step.hidden = false; showCodeError(e.message, nameIn); return; }
      showCodeError(e.message);
    });
  }

  function logout() {
    var b = $('#logoutBtn');
    if (b) { b.disabled = true; b.textContent = 'Saindo…'; }
    api('/api/auth?action=logout', { method: 'POST' }).catch(function () {}).then(function () {
      sdel('ed.st');
      S.progress = {}; sdel('ed.progress'); S.seen = {}; sdel('ed.seen');
      return loadContent();
    }).then(function () {
      closePay();
      if (S.view === 'lesson') { stopPlayer(); chatStop(); showHome(); }
      refreshAll();
      toast('Você saiu da conta.');
    }).catch(function () { location.reload(); });
  }

  // ---------- termos ----------
  var termsNext = null;
  function termsAccepted() { return sget('ed.terms') === '1'; }
  function requireTerms(fn) {
    if (termsAccepted()) { fn(); return; }
    termsNext = fn;
    $('#termsCheck').checked = false;
    $('#termsOk').disabled = true;
    openLayer('termsLayer');
  }
  function declineTerms() {
    termsNext = null;
    closeLayer('termsLayer');
    toast('Para ativar sua chave, é preciso aceitar os termos.');
  }
  function initTerms() {
    var chk = $('#termsCheck'), ok = $('#termsOk');
    chk.addEventListener('change', function () { ok.disabled = !chk.checked; });
    ok.addEventListener('click', function () {
      if (!chk.checked) return;
      sset('ed.terms', '1');
      var fn = termsNext; termsNext = null;
      closeLayer('termsLayer');
      if (fn) setTimeout(fn, REDUCED ? 0 : 220);
    });
    $('#termsNo').addEventListener('click', declineTerms);
    $('#termsBack').addEventListener('click', function () { $('#termsDeclined').hidden = true; $('#termsMain').hidden = false; });
  }

  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }

  // ---------- eventos ----------
  document.addEventListener('click', function (e) {
    var t = e.target, el;

    if ((el = t.closest('[data-speak]'))) { e.preventDefault(); e.stopPropagation(); speak(el.dataset.speak, el); return; }
    if ((el = t.closest('[data-pay]'))) { e.preventDefault(); openPay(el.dataset.pay); return; }
    if ((el = t.closest('[data-close]'))) { var L = el.closest('.layer'); if (L && L.id === 'payLayer') closePay(); return; }
    if ((el = t.closest('[data-magic-id]'))) { openModule(el.dataset.magicId); return; }
    if ((el = t.closest('[data-lesson]'))) { showLesson(el.dataset.lesson); return; }
    if ((el = t.closest('[data-pdfview]'))) { openPdf(el.dataset.pdfview, el.dataset.title, el.dataset.sub); return; }
    if ((el = t.closest('[data-pdfdl]'))) { downloadPdf(el, el.dataset.pdfdl); return; }
    if ((el = t.closest('[data-pdfv]'))) {
      var pa = el.dataset.pdfv;
      if (pa === 'close') closePdf();
      else if (pa === 'in') zoomPdf(0.25);
      else if (pa === 'out') zoomPdf(-0.25);
      else if (pa === 'retry') { var keep = [PV.id, $('#pdfTitle').textContent]; closePdf(); openPdf(keep[0], keep[1]); }
      else if (pa === 'dl' && PV.id) downloadPdf(el, PV.id);
      return;
    }

    if (t.closest('#brand')) { if (S.view !== 'home') goHome(); else window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); return; }
    if ((el = t.closest('.tab'))) {
      var k = el.dataset.tab;
      if (k === 'home') { if (S.view !== 'home') goHome(); else window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); }
      else if (k === 'courses') { if (S.view !== 'courses') showCourses(); }
      else if (k === 'progress') { if (S.view !== 'progress') showProgress(); }
      else openPay(S.unlocked ? 'account' : 'tab');
      return;
    }

    if ((el = t.closest('.tile'))) { openModule(el.dataset.id); return; }
    if ((el = t.closest('.chip'))) { S.filter = el.dataset.f; renderChips(); renderGrid(); return; }
    if ((el = t.closest('[data-act]'))) {
      var a = el.dataset.act;
      if (a === 'courses') showCourses();
      else if (a === 'courses-back') { stopPlayer(); renderCourses(); setView('courses'); }
      else if (a === 'fs') playerFull();
      else if (a === 'fs-exit') playerExit();
      else if (a === 'retry') boot();
      else if (a === 'clear') { S.q = ''; $('#search').value = ''; renderGrid(); }
      else if (a === 'nextq') { var cur = el.closest('.q'), nx = cur && cur.nextElementSibling; if (nx) nx.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' }); }
      else if (a === 'next') showQuiz(S.mod, S.page + 1, false);
      else if (a === 'redo') { showQuiz(S.mod, S.page, false); window.scrollTo(0, 0); }
      else if (a === 'home') goHome();
      return;
    }

    if (t.closest('#quizView')) {
      if (t.closest('#qBack')) { goHome(); return; }
      if ((el = t.closest('.pg'))) {
        var p = +el.dataset.p;
        if (el.classList.contains('locked')) openPay('page');
        else if (p !== S.page) { showQuiz(S.mod, p, false); window.scrollTo(0, 0); }
        return;
      }
      if ((el = t.closest('.opt'))) { selectOpt(el); return; }
      if ((el = t.closest('.q-check'))) { checkQ(el.closest('.q')); return; }
    }

    if (t.closest('#codeBtn') || t.closest('#nameBtn')) { tryCode(); return; }
    if (t.closest('#logoutBtn')) { logout(); return; }
    if (t.closest('#resetBtn')) {
      var btn = $('#resetBtn');
      if (!resetArmed) {
        resetArmed = true; btn.textContent = 'Toque de novo para confirmar';
        clearTimeout(resetTimer); resetTimer = setTimeout(function () { resetArmed = false; if (btn.isConnected) btn.textContent = 'Zerar progresso'; }, 4000);
      } else {
        S.progress = {}; sdel('ed.progress');
        if (S.me) api('/api/auth?action=progress', { method: 'PUT', body: { reset: true } }).catch(function () {});
        renderProgress(); toast('Progresso zerado.');
      }
    }
  });

  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'chatForm') { e.preventDefault(); chatSend(); }
  });
  document.addEventListener('keydown', function (e) {
    var id = e.target && e.target.id;
    if (e.key === 'Enter' && (id === 'codeInput' || id === 'nameInput')) { e.preventDefault(); tryCode(); }
    if (e.key === 'Enter' && id === 'chatInput' && !e.shiftKey && !e.isComposing && window.matchMedia('(hover: hover)').matches) { e.preventDefault(); chatSend(); }
  });
  document.addEventListener('focusin', function (e) {
    if (e.target && (e.target.id === 'codeInput' || e.target.id === 'nameInput')) {
      var el = e.target;
      setTimeout(function () { try { el.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (x) { } }, 320);
    }
  });
  document.addEventListener('input', function (e) {
    var id = e.target && e.target.id;
    if (id === 'codeInput' || id === 'nameInput') {
      var i = e.target; i.classList.remove('bad'); i.removeAttribute('aria-invalid');
      var er = $('#codeErr'); if (er) er.hidden = true;
    }
    if (id === 'chatInput') { var ta = e.target; ta.style.height = ''; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }
  });
  document.addEventListener('contextmenu', function (e) { if (e.target.closest && e.target.closest('.player')) e.preventDefault(); });
  $('#search').addEventListener('input', function (e) { S.q = e.target.value; renderGrid(); });

  $$('[data-ico]').forEach(function (n) { n.outerHTML = icon(n.getAttribute('data-ico')); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { $('#topbar').classList.toggle('scrolled', !es[0].isIntersecting); }).observe($('#sentinel'));
  }

  // ---------- início ----------
  var preKey = '';
  try {
    var qs = new URLSearchParams(window.location.search);
    preKey = qs.get('chave') || qs.get('codigo') || qs.get('code') || '';
    if (preKey) { try { history.replaceState(null, '', window.location.pathname); } catch (e) { } }
  } catch (e) { }

  function boot() {
    $('#empty').hidden = true;
    renderSkeleton();
    loadContent().then(function () {
      S.ready = true;
      setTimeout(syncHw, 1500);
      return pullProgress();
    }).then(function () {
      refreshHome(); renderTop();
      $('#grid').classList.add('enter');
      setTimeout(function () { $('#grid').classList.remove('enter'); $('#homeView').classList.remove('enter-hero'); }, 1400);
      if (preKey && !S.unlocked) {
        openPay('tab');
      }
    }).catch(function (e) { renderBootError(e.message); });
  }

  try { history.scrollRestoration = 'manual'; } catch (e) { }
  setView('home');
  window.scrollTo(0, 0);
  initTerms();
  boot();
})();
