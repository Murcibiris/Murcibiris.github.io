function compararModelos() {
  const P0 = parseFloat(document.getElementById('p0').value);
  const P1 = parseFloat(document.getElementById('p1').value);
  const t = parseFloat(document.getElementById('t').value);
  const tf = parseFloat(document.getElementById('tf').value);
  const K = parseFloat(document.getElementById('kcap').value);
  const P_real = parseFloat(document.getElementById('preal').value);
  const comparar = document.getElementById('comparar').value === 'si';
  const metodo = document.getElementById('metodo').value;

  const labels = [], logData = [], datasets = [];
  let resultado = '', pasos = '';

  const C = (K - P0) / P0;
  const r = -Math.log(((K / P1) - 1) / C);
  const P_log = K / (1 + C * Math.exp(-r * tf));
  const err_log = P_real ? (Math.abs(P_real - P_log) / P_real * 100) : null;

  resultado += `<strong>Modelo Logístico (${metodo === 'laplace' ? 'Laplace' : 'Normal'}):</strong><br>` +
               `Estimación: ${Math.round(P_log).toLocaleString('es-CO')} hab.${err_log !== null ? ` (Error: ${err_log.toFixed(2)}%)` : ''}`;

  pasos += `<strong>Paso a paso (Modelo Logístico - ${metodo === 'laplace' ? 'Laplace' : 'Normal'}):</strong><br>` +
           `C = (${K} - ${P0}) / ${P0} = ${C.toFixed(10)}<br>` +
           `r = -ln(((K/P1) - 1) / C) = ${r.toFixed(10)}<br>` +
           `P(${tf}) = ${K} / (1 + ${C.toFixed(10)} * e^(-${r.toFixed(10)} * ${tf})) = ${Math.round(P_log).toLocaleString('es-CO')}`;

  for (let i = 0; i <= tf + 2; i++) {
    labels.push(i);
    logData.push(K / (1 + C * Math.exp(-r * i)));
  }

  datasets.push({
    label: 'Modelo Logístico',
    data: logData,
    borderColor: '#008000',
    backgroundColor: 'rgba(0,128,0,0.1)',
    fill: false,
    tension: 0.2
  });

  if (comparar) {
    const k = Math.log(P1 / P0) / t;
    const P_exp = P0 * Math.exp(k * tf);
    const err_exp = P_real ? (Math.abs(P_real - P_exp) / P_real * 100) : null;

    resultado = `<strong>Comparación de Modelos:</strong><br>` +
                `<u>Exponencial</u>: ${Math.round(P_exp).toLocaleString('es-CO')} hab.${err_exp !== null ? ` (Error: ${err_exp.toFixed(2)}%)` : ''}<br>` +
                `<u>Logístico (${metodo === 'laplace' ? 'Laplace' : 'Normal'})</u>: ${Math.round(P_log).toLocaleString('es-CO')} hab.${err_log !== null ? ` (Error: ${err_log.toFixed(2)}%)` : ''}`;

    pasos = `<strong>Paso a paso:</strong><br>` +
            `<u>Exponencial</u>: k = ln(${P1}/${P0})/${t} = ${k.toFixed(10)}<br>` +
            `P(t) = ${P0} * e^(${k.toFixed(10)} * ${tf}) = ${Math.round(P_exp).toLocaleString('es-CO')}<br><br>` +
            `<u>Logístico (${metodo === 'laplace' ? 'Laplace' : 'Normal'})</u>:<br>` +
            `C = (${K} - ${P0}) / ${P0} = ${C.toFixed(10)}<br>` +
            `r = -ln(((K/P1) - 1) / C) = ${r.toFixed(10)}<br>` +
            `P(t) = ${K} / (1 + ${C.toFixed(10)} * e^(-${r.toFixed(10)} * ${tf})) = ${Math.round(P_log).toLocaleString('es-CO')}`;

    const expData = [];
    for (let i = 0; i <= tf + 2; i++) {
      expData.push(P0 * Math.exp(k * i));
    }
    datasets.unshift({
      label: 'Modelo Exponencial',
      data: expData,
      borderColor: '#007acc',
      backgroundColor: 'rgba(0,122,204,0.1)',
      fill: false,
      tension: 0.2
    });
  }

  document.getElementById('resultado').innerHTML = resultado;
  document.getElementById('pasos').innerHTML = pasos;
  document.getElementById('laplaceExplicacion').style.display = metodo === 'laplace' ? 'block' : 'none';

  const ctx = document.getElementById('grafico').getContext('2d');
  if (window.miGrafico) window.miGrafico.destroy();

  window.miGrafico = new Chart(ctx, {
    type: 'line',
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: ctx => `${Math.round(ctx.parsed.y).toLocaleString('es-CO')} hab.`
          }
        }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}
