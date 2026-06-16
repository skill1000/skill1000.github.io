/**
 * 虚实融合全域康养数字生命系统 - 主应用入口
 * 负责页面路由、全局状态管理、工具函数
 */

// ========== 全局应用状态 ==========
const AppState = {
    currentPage: 'dashboard',
    user: {
        name: '张建国',
        age: 68,
        gender: '男',
        avatar: '张'
    },
    // 模拟体征数据
    vitalSigns: {
        heartRate: [72, 75, 71, 73, 70, 74, 72],
        systolic: [128, 132, 125, 130, 127, 129, 125],
        diastolic: [82, 85, 80, 83, 81, 84, 82],
        bloodOxygen: [98, 97, 99, 98, 97, 98, 98],
        bodyTemp: [36.4, 36.5, 36.3, 36.6, 36.5, 36.4, 36.5],
        bloodSugar: [5.6, 5.8, 5.5, 5.7, 5.9, 5.6, 5.8]
    },
    // 历史数据（30天）
    historyData: {
        dates30: generateDateLabels(30),
        dates7: generateDateLabels(7)
    },
    // 训练状态
    training: {
        currentModule: null,
        score: 0,
        round: 1,
        totalRounds: 10,
        timer: null,
        startTime: 0,
        correctCount: 0
    }
};

// ========== 工具函数 ==========

/**
 * 生成日期标签数组
 */
function generateDateLabels(days) {
    const labels = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return labels;
}

/**
 * 显示Toast提示
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    
    const icons = { success: '✓', error: '✗', warning: '⚠' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
}

/**
 * 页面路由切换
 */
function navigateTo(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新导航激活状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
    
    // 关闭移动端菜单
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('open');
    
    AppState.currentPage = pageId;
    
    // 触发页面对应的初始化
    triggerPageInit(pageId);
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 触发页面的初始化回调
 */
function triggerPageInit(pageId) {
    switch (pageId) {
        case 'dashboard':
            if (typeof initDashboard === 'function') initDashboard();
            break;
        case 'health-archive':
            if (typeof initHealthArchive === 'function') initHealthArchive();
            break;
        case 'vital-signs':
            if (typeof initVitalSigns === 'function') initVitalSigns();
            break;
        case 'digital-twin':
            if (typeof initDigitalTwin === 'function') initDigitalTwin();
            break;
        case 'cognitive-training':
            if (typeof initCognitiveTraining === 'function') initCognitiveTraining();
            break;
        case 'report-management':
            if (typeof initReportManagement === 'function') initReportManagement();
            break;
    }
}

/**
 * 生成模拟数据（带随机波动）
 */
function generateMockData(baseValue, count, variance) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const fluctuation = (Math.random() - 0.5) * 2 * variance;
        let value = baseValue + fluctuation;
        value = Math.round(value * 10) / 10;
        data.push(Math.max(0, value));
    }
    return data;
}

/**
 * 扩展数据到指定长度
 */
function extendData(data, targetLength, baseVariance) {
    const result = [...data];
    while (result.length < targetLength) {
        const lastVal = result[result.length - 1];
        const fluctuation = (Math.random() - 0.5) * baseVariance;
        result.push(Math.round((lastVal + fluctuation) * 10) / 10);
    }
    return result.slice(0, targetLength);
}

// Chart.js 全局配置
if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
    Chart.defaults.font.size = 13;
    Chart.defaults.color = '#595959';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 16;
}

// ========== DOM Ready 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    // 导航点击事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) navigateTo(page);
        });
    });
    
    // 移动端菜单切换
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            // 动画效果：汉堡变X
            const spans = this.querySelectorAll('span');
            if (navLinks.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }
    
    // 快捷入口跳转
    document.querySelectorAll('.quick-entry-card').forEach(card => {
        card.addEventListener('click', function() {
            const target = this.dataset.goto;
            if (target) navigateTo(target);
        });
    });
    
    // 初始化首页
    navigateTo('dashboard');
    
    console.log('[数字生命系统] 系统初始化完成');
});
