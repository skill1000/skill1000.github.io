/**
 * 体征监测模块
 * 数据录入、图表展示、异常预警
 */

let vsCharts = {};
let currentVSP = 7; // 当前查看周期

function initVitalSigns() {
    initVSForm();
    initVSPeriodSelector();
    renderVSAllCharts(currentVSP);
}

// ========== 表单提交 ==========
function initVSForm() {
    const form = document.getElementById('vitalInputForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const hr = document.getElementById('inputHeartRate').value;
        const sys = document.getElementById('inputSystolic').value;
        const dia = document.getElementById('inputDiastolic').value;
        const bo = document.getElementById('inputBloodOxygen').value;
        const temp = document.getElementById('inputBodyTemp').value;
        const sugar = document.getElementById('inputBloodSugar').value;
        
        // 数据校验
        if (!hr || !sys || !dia || !bo || !temp) {
            showToast('请填写完整的必填项', 'warning');
            return;
        }
        
        // 模拟保存：更新数据数组头部
        AppState.vitalSigns.heartRate.unshift(parseFloat(hr));
        AppState.vitalSigns.systolic.unshift(parseInt(sys));
        AppState.vitalSigns.diastolic.unshift(parseInt(dia));
        AppState.vitalSigns.bloodOxygen.unshift(parseFloat(bo));
       AppState.vitalSigns.bodyTemp.unshift(parseFloat(temp));
        if (sugar) AppState.vitalSigns.bloodSugar.unshift(parseFloat(sugar));
        
        // 限制数组长度
        const maxLen = 90;
        Object.keys(AppState.vitalSigns).forEach(key => {
            if (AppState.vitalSigns[key].length > maxLen) {
                AppState.vitalSigns[key] = AppState.vitalSigns[key].slice(0, maxLen);
            }
        });
        
        showToast('体征数据已成功保存！', 'success');
        
        // 刷新图表
        renderVSAllCharts(currentVSP);
        
        // 更新Dashboard显示的数值
        updateDashboardValues(hr, `${sys}/${dia}`, bo, temp);
        
        // 重置表单
        form.reset();
    });
}

// ========== 更新Dashboard数值 ==========
function updateDashboardValues(hr, bp, bo, temp) {
    const dashHR = document.getElementById('dashHeartRate');
    const dashBP = document.getElementById('dashBloodPressure');
    const dashBO = document.getElementById('dashBloodOxygen');
    const dashT = document.getElementById('dashBodyTemp');
    
    if (dashHR) dashHR.textContent = hr;
    if (dashBP) dashBP.textContent = bp;
    if (dashBO) dashBO.textContent = bo;
    if (dashT) dashT.textContent = temp;
    
    const updateTime = document.getElementById('dashboardUpdateTime');
    if (updateTime) {
        const now = new Date();
        updateTime.textContent = `最后更新：${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }
}

// ========== 时间段选择器 ==========
function initVSPeriodSelector() {
    const btns = document.querySelectorAll('.period-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            btns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentVSP = parseInt(this.dataset.period);
            renderVSAllCharts(currentVSP);
        });
    });
}

// ========== 渲染所有体征图表 ==========
function renderVSAllCharts(period) {
    const count = period;
    const labels = AppState.historyData[`dates${count}`] || generateDateLabels(count);
    
    renderVSHeartRate(labels, count);
    renderVSBP(labels, count);
    renderVSBO(labels, count);
    renderVSTemp(labels, count);
}

// ========== 心率图表 ==========
function renderVSHeartRate(labels, count) {
    const canvas = document.getElementById('vsHeartRateChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (vsCharts.hr) vsCharts.hr.destroy();
    
    const data = extendData(AppState.vitalSigns.heartRate, count, 4);
    
    vsCharts.hr = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '心率',
                data: data,
                borderColor: '#ff4d4f',
                backgroundColor: 'rgba(255,77,79,0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.35,
                pointRadius: 2.5,
                pointHoverRadius: 5
            }]
        },
        options: getVSChartOptions(55, 100)
    });
    
    // 更新统计值
    updateStatDisplay('vsAvgHR', avg(data), 'vsMaxHR', max(data), 'vsMinHR', min(data));
    updateLatestDisplay('vsLatestHR', `${data[0]} 次/分`);
}

// ========== 血压图表 ==========
function renderVSBP(labels, count) {
    const canvas = document.getElementById('vsBPChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (vsCharts.bp) vsCharts.bp.destroy();
    
    const sysData = extendData(AppState.vitalSigns.systolic, count, 6);
    const diaData = extendData(AppState.vitalSigns.diastolic, count, 3);
    
    vsCharts.bp = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: '收缩压', data: sysData, borderColor: '#1890ff', backgroundColor: 'transparent', borderWidth: 2, tension: 0.35, pointRadius: 2 },
                { label: '舒张压', data: diaData, borderColor: '#13c2c2', backgroundColor: 'transparent', borderWidth: 2, tension: 0.35, pointRadius: 2 }
            ]
        },
        options: getVSChartOptions(60, 160)
    });
    
    updateStatDisplay('vsAvgSys', avg(sysData).toFixed(0), 'vsAvgDia', avg(diaData).toFixed(0));
    updateLatestDisplay('vsLatestBP', `${sysData[0]}/${diaData[0]} mmHg`);
}

// ========== 血氧图表 ==========
function renderVSBO(labels, count) {
    const canvas = document.getElementById('vsBOChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (vsCharts.bo) vsCharts.bo.destroy();
    
    const data = extendData(AppState.vitalSigns.bloodOxygen, count, 1.5);
    
    vsCharts.bo = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '血氧饱和度 %',
                data: data,
                borderColor: '#13c2c2',
                backgroundColor: 'rgba(19,194,194,0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.35,
                pointRadius: 2.5
            }]
        },
        options: getVSChartOptions(92, 100)
    });
    
    updateStatDisplay('vsAvgBO', avg(data).toFixed(1), 'vsMinBO', min(data).toFixed(1));
    // 达标率（>=95%）
    const passRate = ((data.filter(v => v >= 95).length / data.length) * 100).toFixed(0);
    updateTextDisplay('vsBORate', `${passRate}%`);
    updateLatestDisplay('vsLatestBO', `${data[0]} %`);
}

// ========== 体温图表 ==========
function renderVSTemp(labels, count) {
    const canvas = document.getElementById('vsTempChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (vsCharts.temp) vsCharts.temp.destroy();
    
    const data = extendData(AppState.vitalSigns.bodyTemp, count, 0.25);
    
    vsCharts.temp = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '体温 °C',
                data: data,
                borderColor: '#fa8c16',
                backgroundColor: 'rgba(250,140,22,0.08)',
                borderWidth: 2,
                fill: true,
                tension: 0.35,
                pointRadius: 2.5
            }]
        },
        options: getVSChartOptions(35.5, 38)
    });
    
    updateStatDisplay('vsAvgTemp', avg(data).toFixed(1), 'vsMaxTemp', max(data).toFixed(1), 'vsMinTemp', min(data).toFixed(1));
    updateLatestDisplay('vsLatestTemp', `${data[0]} °C`);
}

// ========== 图表通用配置 ==========
function getVSChartOptions(yMin, yMax) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { min: yMin, max: yMax, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } }
        },
        plugins: {
            legend: { position: 'top', align: 'end', labels: { boxWidth: 12, padding: 12 } }
        },
        interaction: { intersect: false, mode: 'index' }
    };
}

// ========== 统计工具函数 ==========
function avg(arr) { return arr.reduce((a,b)=>a+b,0)/arr.length; }
function max(arr) { return Math.max(...arr); }
function min(arr) { return Math.min(...arr); }

function updateStatDisplay(avgId, avgVal, maxId, maxVal, minId, minVal) {
    if (avgId) { const el = document.getElementById(avgId); if (el) el.textContent = typeof avgVal === 'number' ? Math.round(avgVal) : avgVal; }
    if (maxId) { const el = document.getElementById(maxId); if (el) el.textContent = typeof maxVal === 'number' ? Math.round(maxVal) : maxVal; }
    if (minId) { const el = document.getElementById(minId); if (el) el.textContent = typeof minVal === 'number' ? Math.round(minVal) : minVal; }
}

function updateLatestDisplay(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateTextDisplay(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
