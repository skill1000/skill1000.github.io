/**
 * 健康档案模块
 * 个人信息管理、疾病记录、用药记录、生活习惯
 */

let archiveCharts = {};

function initHealthArchive() {
    initArchiveTabs();
    initBMITrendChart();
}

// ========== 档案标签页切换 ==========
function initArchiveTabs() {
    const tabs = document.querySelectorAll('.archive-tab');
    const panels = document.querySelectorAll('.archive-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.dataset.tab;
            
            // 切换标签激活状态
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 切换面板显示
            panels.forEach(panel => {
                panel.style.display = 'none';
            });
            
            const targetPanel = document.getElementById(`panel-${targetId}`);
            if (targetPanel) {
                targetPanel.style.display = 'block';
            }
        });
    });
}

// ========== BMI趋势图 ==========
function initBMITrendChart() {
    const canvas = document.getElementById('bmiTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (archiveCharts.bmi) archiveCharts.bmi.destroy();
    
    // 模拟近12个月BMI数据
    const labels = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        labels.push(`${d.getMonth() + 1}月`);
    }
    
    const bmiData = [24.8, 24.5, 24.3, 24.1, 23.9, 24.0, 24.2, 24.3, 24.1, 24.0, 23.9, 24.0];
    
    archiveCharts.bmi = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'BMI 指数',
                data: bmiData,
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24,144,255,0.1)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#1890ff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 18,
                    max: 28,
                    grid: { color: 'rgba(0,0,0,0.04)' }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { display: true, position: 'top' },
                annotation: { /* BMI参考线 */ }
            }
        },
        plugins: [{
            afterDraw: function(chart) {
                const ctx = chart.ctx;
                const yAxis = chart.scales.y;
                const xAxis = chart.scales.x;
                
                // 正常范围线 18.5-23.9
                const normalTop = yAxis.getPixelForValue(23.9);
                const normalBottom = yAxis.getPixelForValue(18.5);
                
                ctx.save();
                ctx.fillStyle = 'rgba(82,196,26,0.06)';
                ctx.fillRect(xAxis.left, normalTop, xAxis.right - xAxis.left, normalBottom - normalTop);
                
                // 绘制参考线
                ctx.setLineDash([5, 4]);
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(82,196,26,0.4)';
                
                ctx.beginPath();
                ctx.moveTo(xAxis.left, normalTop);
                ctx.lineTo(xAxis.right, normalTop);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(xAxis.left, normalBottom);
                ctx.lineTo(xAxis.right, normalBottom);
                ctx.stroke();
                
                ctx.restore();
            }
        }]
    });
}
