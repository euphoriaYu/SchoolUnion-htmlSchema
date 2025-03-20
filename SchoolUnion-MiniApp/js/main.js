// 更新状态栏时间
function updateStatusBarTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // 格式化时间为两位数
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    const timeString = `${hours}:${minutes}`;
    
    // 更新所有状态栏时间元素
    const timeElements = document.querySelectorAll('.status-bar-time');
    timeElements.forEach(el => {
        el.textContent = timeString;
    });
}

// 初始化时更新时间，并每分钟更新一次
updateStatusBarTime();
setInterval(updateStatusBarTime, 60000);

// 标签切换功能
function setupTabNavigation() {
    const tabNavItems = document.querySelectorAll('.tab-nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabNavItems.length === 0 || tabContents.length === 0) return;
    
    tabNavItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 移除所有活动状态
            tabNavItems.forEach(i => i.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');
            
            // 添加当前活动状态
            item.classList.add('active');
            tabContents[index].style.display = 'block';
        });
    });
    
    // 默认显示第一个标签内容
    tabNavItems[0].classList.add('active');
    tabContents[0].style.display = 'block';
}

// 底部标签栏切换功能
function setupTabBar() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    if (tabItems.length === 0) return;
    
    // 获取当前页面的文件名
    const currentPage = window.location.pathname.split('/').pop();
    
    tabItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        }
        
        // 在iframe中，通过data-page属性判断
        const dataPage = item.getAttribute('data-page');
        if (dataPage && currentPage.includes(dataPage)) {
            item.classList.add('active');
        }
    });
}

// 模态框功能
function setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    const modals = document.querySelectorAll('.modal');
    
    if (modalTriggers.length === 0) return;
    
    // 打开模态框
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });
    
    // 关闭模态框
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // 点击模态框背景关闭
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// 文本展开/折叠功能
function setupTextExpand() {
    const expandButtons = document.querySelectorAll('.expand-text');
    
    if (expandButtons.length === 0) return;
    
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textElement = button.previousElementSibling;
            if (textElement) {
                textElement.classList.toggle('truncate');
                button.textContent = textElement.classList.contains('truncate') ? '展开' : '收起';
            }
        });
    });
}

// 图片预览功能
function setupImagePreview() {
    const uploadInputs = document.querySelectorAll('.upload-input');
    
    if (uploadInputs.length === 0) return;
    
    uploadInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            
            const previewContainer = input.closest('.upload-item').querySelector('.upload-preview-container');
            if (!previewContainer) return;
            
            // 清空预览容器
            previewContainer.innerHTML = '';
            
            // 创建图片预览
            const file = files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('upload-preview');
                previewContainer.appendChild(img);
                
                // 显示删除按钮
                const deleteBtn = document.createElement('div');
                deleteBtn.classList.add('upload-delete');
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                previewContainer.appendChild(deleteBtn);
                
                // 删除图片功能
                deleteBtn.addEventListener('click', () => {
                    previewContainer.innerHTML = '';
                    input.value = '';
                });
            };
            
            reader.readAsDataURL(file);
        });
    });
}

// 表单验证功能
function setupFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    if (forms.length === 0) return;
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const requiredInputs = form.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    // 添加错误样式
                    input.classList.add('error');
                    
                    // 显示错误消息
                    const errorElement = input.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.style.display = 'block';
                    }
                } else {
                    // 移除错误样式
                    input.classList.remove('error');
                    
                    // 隐藏错误消息
                    const errorElement = input.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.style.display = 'none';
                    }
                }
            });
            
            if (isValid) {
                // 表单验证通过，可以提交
                console.log('表单验证通过');
                // 这里可以添加表单提交逻辑
            }
        });
    });
}

// 设置左右滑动返回功能
function setupSwipeNavigation() {
    let startX;
    let endX;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        
        // 如果是在详情页面，支持从左向右滑动返回
        if (window.location.pathname.includes('card-detail.html') && endX - startX > 100) {
            history.back();
        }
    });
}

// 名片点击功能
function setupCardInteractions() {
    // 简要名片点击功能（如果不是链接）
    const briefCards = document.querySelectorAll('.card-brief:not(a .card-brief)');
    
    briefCards.forEach(card => {
        card.addEventListener('click', () => {
            // 检查是否在分享按钮上点击
            if (event.target.closest('.share-btn')) {
                return;
            }
            
            window.location.href = 'card-detail.html';
        });
    });
    
    // 分享按钮功能
    const shareButtons = document.querySelectorAll('.card-brief .share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡，防止触发名片点击
            
            // 检查是否有分享模态框
            const shareModal = document.getElementById('shareModal');
            if (shareModal) {
                shareModal.style.display = 'flex';
            }
        });
    });
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    updateStatusBarTime();
    setupTabNavigation();
    setupTabBar();
    setupModals();
    setupTextExpand();
    setupImagePreview();
    setupFormValidation();
    setupSwipeNavigation();
    setupCardInteractions();
});

// 在iframe中，需要监听iframe加载完成事件
window.addEventListener('load', () => {
    // 检查是否在iframe中
    if (window.self !== window.top) {
        // 在iframe中，初始化功能
        updateStatusBarTime();
        setupTabNavigation();
        setupTabBar();
        setupModals();
        setupTextExpand();
        setupImagePreview();
        setupFormValidation();
        setupSwipeNavigation();
        setupCardInteractions();
    }
});

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 处理返回按钮
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            window.history.back();
        });
    });

    // 处理分享按钮
    const shareButtons = document.querySelectorAll('.share-btn');
    const shareModal = document.getElementById('shareModal');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(shareModal) {
                shareModal.style.display = 'flex';
            } else {
                alert('分享功能即将上线');
            }
        });
    });

    // 处理模态框关闭
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if(modal) {
                modal.style.display = 'none';
            }
        });
    });

    // 点击模态框外部关闭
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });

    // 标签页切换功能
    const tabNavItems = document.querySelectorAll('.tab-nav-item');
    tabNavItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // 移除所有tab的active类
            tabNavItems.forEach(tab => tab.classList.remove('active'));
            // 给当前点击的tab添加active类
            this.classList.add('active');
            
            // 处理对应的内容区域
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            if (tabContents[index]) {
                tabContents[index].classList.add('active');
            }
        });
    });

    // 页面左右滑动返回功能
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        // 向右滑动超过50px视为返回操作
        if (touchEndX - touchStartX > 100) {
            window.history.back();
        }
    }

    // 处理会员认证按钮
    const memberBtn = document.querySelector('.member-status .btn');
    if(memberBtn) {
        memberBtn.addEventListener('click', function() {
            alert('会员认证功能即将上线');
        });
    }

    // 处理设置项目点击
    const settingsItems = document.querySelectorAll('.settings-item');
    settingsItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.settings-item-title').textContent;
            if(title === '退出登录') {
                if(confirm('确定要退出登录吗？')) {
                    alert('已退出登录');
                    window.location.href = 'home.html';
                }
            } else if(title === '登录/注册') {
                alert('登录/注册功能即将上线');
            } else if(title === '帮助与反馈') {
                alert('帮助与反馈功能即将上线');
            } else if(title === '关于我们') {
                alert('聚力校元是连接校园学生组织与个人的桥梁，致力于打破学生组织间的信息壁垒，促进资源共享与合作创新。');
            }
        });
    });

    // 处理官方动态交互
    const officialActions = document.querySelectorAll('.official-action');
    officialActions.forEach(action => {
        action.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('span');
            
            if(icon.classList.contains('fa-heart')) {
                if(icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#f44336';
                    let count = parseInt(countSpan.textContent) + 1;
                    countSpan.textContent = count;
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    let count = parseInt(countSpan.textContent) - 1;
                    countSpan.textContent = count;
                }
            } else if(icon.classList.contains('fa-comment')) {
                alert('评论功能即将上线');
            } else if(icon.classList.contains('fa-share-square')) {
                if(shareModal) {
                    shareModal.style.display = 'flex';
                } else {
                    alert('分享功能即将上线');
                }
            }
        });
    });

    // 处理链接功能按钮
    const connectionActionBtns = document.querySelectorAll('.connection-action-btn');
    connectionActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if(icon.classList.contains('fa-comment')) {
                alert('聊天功能即将上线');
            } else if(icon.classList.contains('fa-star')) {
                alert('评价功能即将上线');
            } else if(icon.classList.contains('fa-ellipsis-h')) {
                alert('更多功能即将上线');
            }
        });
    });

    // 处理发现页面的按钮
    const joinBtns = document.querySelectorAll('.post-actions .btn');
    joinBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = document.getElementById('connectionModal');
            if(modal) {
                modal.style.display = 'flex';
            } else {
                alert('链接功能即将上线');
            }
        });
    });

    // 处理发送链接请求
    const sendLinkBtn = document.querySelector('.card-action-footer .btn');
    if(sendLinkBtn) {
        sendLinkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('已发送链接请求');
            window.history.back();
        });
    }
}); 