/**
 * 首页Dashboard模块
 * 健康概览、体征趋势图、康复进度、快捷入口
 */

let dashCharts = {};

function initDashboard() {
    initHealthScoreRing();
    initDashHeartRateChart();
    initDashBPChart();
    initQuickEntryEvents();
}

// ========== 健康评分环形图 ==========
function initHealthScoreRing() {
    const canvas = document.getElementById('healthScoreRing');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const score = 86;
    const maxScore = 100;
    
    // 清除已有图表
    if (dashCharts.healthScore) {
        dashCharts.healthScore.destroy();
    }
    
    dashCharts.healthScore = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [score, maxScore - score],
                backgroundColor: ['#1890ff', '#f0f0f0'],
                borderWidth: 0,
                cutout: '78%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            animation: { animateRotate: true, duration: 1500, easing: 'easeOutQuart' }
        }
    });
}

// ========== 心率趋势图 ==========
function initDashHeartRateChart(period = 7) {
    const canvas = document.getElementById('dashHeartRateChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const count = period;
    const labels = AppState.historyData[`dates${count}`] || generateDateLabels(count);
    
    // 销毁旧图表
    if (dashCharts.hrTrend) dashCharts.hrTrend.destroy();
    
    const hrData = extendData(AppState.vitalSigns.heartRate, count, 4);
    
    dashCharts.hrTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '心率 (次/分)',
                data: hrData,
                borderColor: '#ff4d4f',
                backgroundColor: 'rgba(255,77,79,0.08)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#ff4d4f',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 55,
                    max: 95,
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { stepSize: 10 }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { position: 'top', align: 'end' }
            }
        }
    });
}

// ========== 血压趋势图 ==========
function initDashBPChart(period = 7) {
    const canvas = document.getElementById('dashBpChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const count = period;
    const labels = AppState.historyData[`dates${count}`] || generateDateLabels(count);
    
    if (dashCharts.bpTrend) dashCharts.bpTrend.destroy();
    
    const sysData = extendData(AppState.vitalSigns.systolic, count, 6);
    const diaData = extendData(AppState.vitalSigns.diastolic, count, 3);
    
    dashCharts.bpTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '收缩压 (高压)',
                    data: sysData,
                    borderColor: '#1890ff',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: '舒张压 (低压)',
                    data: diaData,
                    borderColor: '#13c2c2',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 60,
                    max: 160,
                    grid: { color: 'rgba(0,0,0,0.04)' }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: 'top', align: 'end' }
            }
        }
    });
}

// ========== 快捷入口事件绑定 ==========
function initQuickEntryEvents() {
    // 时间段选择器 - 心率
    const hrSelect = document.getElementById('dashHeartRatePeriod');
    if (hrSelect) {
        hrSelect.addEventListener('change', function() {
            initDashHeartRateChart(parseInt(this.value));
        });
    }
    
    // 时间段选择器 - 血压
    const bpSelect = document.getElementById('dashBpPeriod');
    if (bpSelect) {
        bpSelect.addEventListener('change', function() {
            initDashBPChart(parseInt(this.value));
        });
    }
}
