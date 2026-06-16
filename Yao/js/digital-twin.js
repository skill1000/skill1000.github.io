/**
 * 数字孪生可视化模块
 * 人体模型交互、系统健康度雷达图、实时体征流、数字生命指数
 */

let twinCharts = {};

function initDigitalTwin() {
    initSystemRadarChart();
    initOrganInteractions();
}

// ========== 系统健康度雷达图 ==========
function initSystemRadarChart() {
    const canvas = document.getElementById('systemRadarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (twinCharts.radar) twinCharts.radar.destroy();
    
    twinCharts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['心血管', '呼吸', '神经', '消化', '免疫', '代谢', '骨骼', '泌尿'],
            datasets: [{
                label: '当前健康度',
                data: [88, 95, 78, 82, 85, 76, 80, 90],
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24,144,255,0.15)',
                borderWidth: 2,
                pointBackgroundColor: '#1890ff',
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: '同龄均值',
                data: [75, 80, 70, 72, 74, 68, 70, 78],
                borderColor: '#d9d9d9',
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderDash: [4, 3],
                pointRadius: 2,
                pointBorderColor: '#d9d9d9'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 40,
                    max: 100,
                    ticks: { stepSize: 20, font: { size: 10 } },
                    pointLabels: { font: { size: 12, weight: '500' } },
                    grid: { color: 'rgba(0,0,0,0.06)' },
                    angleLines: { color: 'rgba(0,0,0,0.06)' }
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { padding: 16 } }
            }
        }
    });
}

// ========== 器官点击交互 ==========
function initOrganInteractions() {
    const markers = document.querySelectorAll('.organ-marker');
    const detailTitle = document.getElementById('organDetailTitle');
    const detailContent = document.getElementById('organDetailContent');
    
    if (!detailTitle || !detailContent) return;
    
    const organData = {
        heart: {
            title: '心血管系统',
            html: `
                <div class="organ-stat-row"><span>心率</span><strong>72 次/分</strong> <span style="color:#52c41a">正常</span></div>
                <div class="organ-stat-row"><span>血压</span><strong>125/82 mmHg</strong> <span style="color:#52c41a">正常偏高</span></div>
                <div class="organ-stat-row"><span>心脏负荷指数</span><strong>中等</strong></div>
                <div class="organ-stat-row"><span>血管弹性评分</span><strong>82 / 100</strong></div>
                <p style="margin-top:12px;color:#595959;font-size:13px;line-height:1.7;">
                    心血管系统整体状态良好。血压控制在正常范围上限，建议继续保持低盐饮食和规律运动。
                    历史数据显示近3个月血压波动较小，趋势稳定。
                </p>
            `
        },
        brain: {
            title: '神经系统（认知中枢）',
            html: `
                <div class="organ-stat-row"><span>综合认知指数</span><strong>78 / 100</strong></div>
                <div class="organ-stat-row"><span>记忆力得分</span><strong>92 分</strong></div>
                <div class="organ-stat-row"><span>注意力得分</span><strong>85 分</strong></div>
                <div class="organ-stat-row"><span>反应速度</span><strong>中等偏上</strong></div>
                <div class="organ-stat-row"><span>睡眠质量</span><strong>良好（7.2h/天）</strong></div>
                <p style="margin-top:12px;color:#595959;font-size:13px;line-height:1.7;">
                    认知功能处于良好水平，略高于同龄人平均值。建议坚持每日认知训练，
                    可进一步提升注意力和反应速度。睡眠质量对认知功能有积极影响。
                </p>
            `
        },
        lung: {
            title: '呼吸系统',
            html: `
                <div class="organ-stat-row"><span>血氧饱和度</span><strong>98%</strong> <span style="color:#52c41a">优秀</span></div>
                <div class="organ-stat-row"><span>呼吸频率</span><strong>16 次/分</strong> <span style="color:#52c41a">正常</span></div>
                <div class="organ-stat-row"><span>肺功能评估</span><strong>正常范围</strong></div>
                <p style="margin-top:12px;color:#595959;font-size:13px;line-height:1.7;">
                    呼吸系统功能正常。血氧饱和度持续保持在98%以上，说明肺部气体交换功能良好。
                    建议保持适度有氧运动，如散步、太极拳等。
                </p>
            `
        }
    };
    
    markers.forEach(marker => {
        marker.addEventListener('click', function() {
            const organ = this.dataset.organ;
            const data = organData[organ];
            
            if (data) {
                detailTitle.textContent = data.title;
                detailContent.innerHTML = data.html;
                
                // 高亮效果
                markers.forEach(m => m.style.opacity = '0.4');
                this.style.opacity = '1';
                
                // 添加动画
                detailContent.style.animation = 'fadeInUp 0.3s ease';
            }
        });
        
        // 鼠标悬停提示
        marker.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
            this.querySelector('circle, ellipse').style.strokeWidth = '2.5';
        });
        
        marker.addEventListener('mouseleave', function() {
            if (detailTitle.textContent === '点击身体部位查看详情') return;
            // 保持选中状态的不变
        });
    });
}
