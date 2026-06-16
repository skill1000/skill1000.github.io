/**
 * 体检报告管理模块
 * 报告列表、详情查看、历年趋势对比
 */

let reportCharts = {};

function initReportManagement() {
    initReportCardEvents();
    initReportBPTrendChart();
    initReportLipidTrendChart();
}

// ========== 报告卡片事件 ==========
function initReportCardEvents() {
    // 查看详情按钮
    document.querySelectorAll('.view-report-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reportYear = this.dataset.report;
            showReportDetail(reportYear);
        });
    });
    
    // 下载报告（模拟）
    document.querySelectorAll('.download-report-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showToast('报告下载功能演示：PDF文件已开始下载', 'success');
        });
    });
    
    // 上传报告
    const addBtn = document.getElementById('addReportBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            showToast('上传报告功能演示：请选择PDF/图片文件', 'info');
        });
    }
    
    // 返回列表
    const backBtn = document.getElementById('backToReportsBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            hideReportDetail();
        });
    }
}

// ========== 显示报告详情 ==========
function showReportDetail(year) {
    const listSection = document.querySelector('.reports-list-section');
    const detailView = document.getElementById('reportDetailView');
    const trendSection = document.querySelector('.report-trend-section');
    
    if (listSection) listSection.style.display = 'none';
    if (detailView) detailView.style.display = 'block';
    if (trendSection) trendSection.style.display = 'block';
    
    // 更新标题
    const titleEl = document.getElementById('detailReportTitle');
    if (titleEl) titleEl.textContent = `${year}年度体检报告详情`;
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== 隐藏报告详情 ==========
function hideReportDetail() {
    const listSection = document.querySelector('.reports-list-section');
    const detailView = document.getElementById('reportDetailView');
    const trendSection = document.querySelector('.report-trend-section');
    
    if (listSection) listSection.style.display = '';
    if (detailView) detailView.style.display = 'none';
    if (trendSection) trendSection.style.display = '';
}

// ========== 血压变化趋势图 ==========
function initReportBPTrendChart() {
    const canvas = document.getElementById('reportBpTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (reportCharts.bpTrend) reportCharts.bpTrend.destroy();
    
    const years = ['2023', '2024', '2025', '2026'];
    
    reportCharts.bpTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: '收缩压',
                    data: [142, 138, 135, 132],
                    borderColor: '#ff4d4f',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#ff4d4f',
                    pointBorderWidth: 2
                },
                {
                    label: '舒张压',
                    data: [92, 88, 85, 84],
                    borderColor: '#1890ff',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#1890ff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 60, max: 160, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: 'top', align: 'end' }
            }
        },
        plugins: [{
            afterDraw: function(chart) {
                const ctx = chart.ctx;
                const yAxis = chart.scales.y;
                const xAxis = chart.scales.x;
                
                // 正常血压参考区域
                ctx.save();
                ctx.fillStyle = 'rgba(82,196,26,0.05)';
                const sysNormalTop = yAxis.getPixelForValue(139);
                const diaNormalBottom = yAxis.getPixelForValue(60);
                ctx.fillRect(xAxis.left, sysNormalTop, xAxis.right - xAxis.left, diaNormalBottom - sysNormalTop);
                
                // 参考线
                ctx.setLineDash([5, 4]);
                ctx.lineWidth = 1;
                
                // 收缩压正常上限 139
                ctx.strokeStyle = 'rgba(255,77,79,0.3)';
                ctx.beginPath();
                ctx.moveTo(xAxis.left, yAxis.getPixelForValue(139));
                ctx.lineTo(xAxis.right, yAxis.getPixelForValue(139));
                ctx.stroke();
                
                // 舒张压正常上限 89
                ctx.strokeStyle = 'rgba(24,144,255,0.3)';
                ctx.beginPath();
                ctx.moveTo(xAxis.left, yAxis.getPixelForValue(89));
                ctx.lineTo(xAxis.right, yAxis.getPixelForValue(89));
                ctx.stroke();
                
                ctx.restore();
            }
        }]
    });
}

// ========== 血脂变化趋势图 ==========
function initReportLipidTrendChart() {
    const canvas = document.getElementById('reportLipidTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (reportCharts.lipidTrend) reportCharts.lipidTrend.destroy();
    
    const years = ['2023', '2024', '2025', '2026'];
    
    reportCharts.lipidTrend = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: '总胆固醇 (mmol/L)',
                    data: [6.1, 5.9, 5.8, 5.6],
                    backgroundColor: 'rgba(24,144,255,0.7)',
                    borderRadius: 4,
                    barPercentage: 0.6
                },
                {
                    label: '甘油三酯 (mmol/L)',
                    data: [2.2, 2.0, 1.9, 1.8],
                    backgroundColor: 'rgba(82,196,26,0.7)',
                    borderRadius: 4,
                    barPercentage: 0.6
                },
                {
                    label: 'LDL-C (mmol/L)',
                    data: [3.9, 3.7, 3.6, 3.4],
                    backgroundColor: 'rgba(250,140,22,0.7)',
                    borderRadius: 4,
                    barPercentage: 0.6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 7, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: 'top', align: 'end' }
            }
        },
        plugins: [{
            afterDraw: function(chart) {
                const ctx = chart.ctx;
                const yAxis = chart.scales.y;
                const xAxis = chart.scales.x;
                
                // 总胆固醇参考线 5.2
                ctx.save();
                ctx.setLineDash([5, 4]);
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = 'rgba(24,144,255,0.4)';
                const yPos = yAxis.getPixelForValue(5.2);
                ctx.beginPath();
                ctx.moveTo(xAxis.left, yPos);
                ctx.lineTo(xAxis.right, yPos);
                ctx.stroke();
                
                ctx.fillStyle = 'rgba(24,144,255,0.6)';
                ctx.font = '11px sans-serif';
                ctx.fillText('参考值 5.2', xAxis.right - 70, yPos - 5);
                ctx.restore();
            }
        }]
    });
}
