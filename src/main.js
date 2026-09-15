import './style.css';
import { createIcons, ArrowUpRight, ArrowDown, ArrowRight, Plus, Minus, X, RotateCcw, Sun, Moon, Volume2, VolumeX, Download, MousePointer2, Sparkles, Check, Copy, Menu, GraduationCap, Camera, Monitor, Lightbulb, BookOpen, Hand, ChevronRight } from 'lucide';
import { projects, experiences, skills, profile } from './content.js';
import { createStudio } from './scene.js';

const iconSet = { ArrowUpRight, ArrowDown, ArrowRight, Plus, Minus, X, RotateCcw, Sun, Moon, Volume2, VolumeX, Download, MousePointer2, Sparkles, Check, Copy, Menu, GraduationCap, Camera, Monitor, Lightbulb, BookOpen, Hand, ChevronRight };
const icon = (name, extra = '') => `<i data-lucide="${name}" ${extra}></i>`;
const refreshIcons = () => createIcons({ icons: iconSet, attrs: { 'stroke-width': 1.6, 'aria-hidden': 'true' } });
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const projectArt = {
  wedding: `<div class="art-label">内容里的，小小转折。</div><div class="video-card"><div class="video-camera">${icon('camera')}</div><span class="video-timer">故事，先于花絮</span><div class="video-timeline"><b></b><b></b><b></b><b></b><b></b></div></div><div class="result-sticker"><span>完播率</span><strong>40<span>→</span>80<small>%</small></strong>${icon('arrow-up-right')}</div><span class="art-caption">内容结构优化 / 影石</span><span class="art-flower">✳</span>`,
  game: `<div class="art-label">体验，是可以被改变的。</div><div class="game-window"><div class="window-chrome"><span></span><span></span><span></span><b>游戏体验实验室</b></div><div class="game-graph"><svg viewBox="0 0 300 85"><path d="M0 75L25 66L50 70L75 45L100 51L125 26L150 34L175 10L200 18L225 8L250 14L275 7L300 9" fill="none" stroke="currentColor" stroke-width="3"/></svg><div class="graph-label">更流畅，也更可复用。</div></div><div class="game-stats"><b>16<small>款游戏</small></b><b>2<small>个 AI Skill</small></b></div></div><span class="game-key">↗</span><span class="art-caption">配置验证与上线 / 腾讯</span>`,
  launch: `<div class="art-label">让每一环，准时发生。</div><div class="paper paper-back"><span>新品传播</span><strong>连接<br>每一环。</strong><div class="paper-circle"></div></div><div class="paper paper-front"><span>从创意到交付</span><strong>20<small>%</small></strong><p>交付周期缩短约</p><div class="paper-lines"></div></div><span class="art-caption">流程优化与上市传播 / 阳狮</span><span class="paper-star">✳</span>`,
  wangwang: `<div class="art-label">先理解人，再创造不同。</div><div class="idea-orbit orbit-a"></div><div class="idea-orbit orbit-b"></div><div class="idea-face"><span>新</span><span>意</span></div><div class="idea-note note-a">200+ 份问卷</div><div class="idea-note note-b">3 项创新方向</div><span class="art-caption">消费者洞察 / 旺旺产品创新企划</span>`
};

const assetBase = `${import.meta.env.BASE_URL}assets`;
const app = document.querySelector('#app');
app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#home" aria-label="Rin 首页">Rin<span class="brand-dot">.</span><span class="brand-caption">党艺灵的个人宇宙</span></a>
    <nav class="desktop-nav" aria-label="主导航">
      <a href="#about">关于我</a><a href="#projects">精选项目</a><a href="#journey">成长轨迹</a><a href="#skills">我的工具箱</a>
    </nav>
    <div class="header-actions"><button class="resume-button" data-resume>一页认识我 ${icon('arrow-up-right')}</button><button class="icon-button mobile-menu" aria-label="打开导航" aria-expanded="false">${icon('menu')}</button></div>
  </header>
  <main>
    <section class="hero" id="home" aria-labelledby="hero-title">
      <div class="hero-copy">
        <div class="eyebrow"><span class="status-dot"></span> 2027 届 · 好奇心持续在线</div>
        <h1 id="hero-title"><span class="hello">你好，我是</span><span class="hero-name">Rin<span class="name-period">.</span><span class="name-asterisk" aria-hidden="true">✳</span></span></h1>
        <div class="identity"><span>党艺灵</span><span class="identity-line"></span>一个把想法落地的人</div>
        <h2>把好奇心，<br>做成<span class="underlined">影响力</span>。</h2>
        <p class="hero-description">在品牌、用户与技术之间探索。<br>用内容打动人，用产品解决问题，<br>也用 AI，让好想法更快发生。</p>
        <a href="#projects" class="button primary">看看我的实践 ${icon('arrow-up-right')}</a>
        <div class="hero-fields"><span>品牌营销</span><span>产品运营</span><span>AI 应用</span></div>
      </div>
      <div class="scene-wrap">
        <div class="scene-top-note"><span class="tiny-cross">+</span> 好的想法，从这里开始 <span class="tiny-cross">+</span></div>
        <div id="studio" class="studio"><div class="scene-loading" data-model-status>正在布置我的工作室…</div></div>
        <button class="scene-hotspot hotspot-about" data-scene-action="about">${icon('hand')} 认识 Rin <span>↗</span></button>
        <button class="scene-hotspot hotspot-work" data-scene-action="projects">${icon('monitor')} 工作中的我 <span>↗</span></button>
        <div class="speech-bubble" role="status">嘿，很高兴认识你！</div>
        <div class="scene-handwriting">小小工作室，大大的好奇心。<svg viewBox="0 0 66 40" aria-hidden="true"><path d="M2 4Q28 3 45 30M33 25L46 32L48 18"/></svg></div>
        <div class="scene-toolbar"><span>${icon('mouse-pointer-2')} 拖动，换个角度</span><div><button class="icon-button" data-reset aria-label="恢复初始视角" title="恢复视角">${icon('rotate-ccw')}</button><button class="icon-button" data-night aria-label="切换夜间工作室" aria-pressed="false" title="切换昼夜">${icon('moon')}</button><button class="icon-button" data-wave aria-label="和 Rin 打招呼" title="打个招呼">${icon('hand')}</button></div></div>
      </div>
      <div class="hero-footer"><a href="#about">${icon('arrow-down')} 下滑，认识更多面的我</a><button data-avatar class="avatar-origin"><img src="${assetBase}/rin-reference.jpg" alt="Rin 的原始二维人物插画"/><span>从一张插画，<br><b>到一个立体的我。</b></span>${icon('arrow-up-right')}</button><span class="hero-coordinate">不设边界 · 持续生长</span></div>
    </section>
    <div class="brand-strip" aria-label="实习经历概览"><span>我的足迹，曾在这里</span><div class="company-logo tencent">腾讯 <small>平台与内容</small></div><div class="company-logo insta">影石 <b>Insta360</b></div><div class="company-logo publicis">阳狮集团 <small>PUBLICIS GROUPE</small></div><div class="company-logo asia">亚信科技 <small>AI 产品研发</small></div></div>
    <section class="about section" id="about">
      <div class="section-marker"><span>01 / 关于我</span><span>保持好奇，认真落地。</span></div>
      <div class="about-grid"><div class="section-heading"><h2>不止<br>一个标签<span class="orange">。</span></h2><div class="little-orbit" aria-hidden="true"><div></div><span>人 × 内容 × 技术</span></div></div><div class="about-main"><h3>理解品牌的表达，<br>也关心用户的<span class="serif-accent">真实感受。</span></h3><p>我是党艺灵，也可以叫我 Rin。就读于暨南大学新闻与传播专业，预计 2027 年硕士毕业。从品牌方、代理方走到平台方，我越来越确定：好的创意，不只要被看见，更要带来真实的改变。</p><p>我喜欢从一个具体问题出发，观察、拆解、动手试一试，再用反馈验证判断。内容策略、用户体验、AI 工作流，是我目前最投入的三个方向。</p><div class="about-notes"><div><span>我的工作习惯</span><b>先理解问题，再选择工具。</b></div><div><span>我相信的事</span><b>有温度的洞察，有依据的行动。</b></div></div></div></div>
      <div class="education-strip"><div>${icon('graduation-cap')}<span><b>暨南大学</b> 新闻与传播 · 推免硕士<small>2024.09 — 2027.06</small></span></div><div>${icon('book-open')}<span><b>内蒙古大学</b> 网络与新媒体 · 本科<small>2020.09 — 2024.06 · 专业前 5%</small></span></div><div class="education-award">自治区优秀毕业生<br><span>第 34 届金犊奖大陆赛区三等奖</span></div></div>
    </section>
    <section class="projects section" id="projects">
      <div class="section-marker"><span>02 / 精选项目</span><span>不只做过，更想明白过。</span></div>
      <div class="section-title-row"><h2>想法，有了<span class="serif-accent">回响。</span></h2><p>几段真实的实践，<br>关于判断、行动，和它们带来的变化。</p></div>
      <div class="project-filters" role="group" aria-label="筛选项目"><button class="active" data-filter="全部" aria-pressed="true">全部 <sup>04</sup></button><button data-filter="营销策略" aria-pressed="false">营销策略</button><button data-filter="产品运营" aria-pressed="false">产品运营</button><button data-filter="用户洞察" aria-pressed="false">用户洞察</button></div>
      <div class="project-grid">${projects.map((p, i) => `<article class="project-card" data-category="${p.category}" data-project-card="${p.id}"><button class="project-art art-${p.id}" data-project="${p.id}" aria-label="查看${escapeHTML(p.title)}项目详情">${projectArt[p.id]}<span class="project-open">${icon('arrow-up-right')}</span></button><div class="project-meta"><span>${p.company} / ${p.category}</span><span>0${i + 1}</span></div><h3><button data-project="${p.id}">${p.title} ${icon('arrow-up-right')}</button></h3><p>${p.subtitle}</p><div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div></article>`).join('')}</div>
      <p class="project-footnote">以上为真实项目复盘；封面为概念视觉，不代表品牌官方物料。</p>
    </section>
    <section class="journey section" id="journey"><div class="section-marker"><span>03 / 成长轨迹</span><span>把不同视角，带进下一次实践。</span></div><div class="journey-grid"><div class="journey-intro"><h2>一路走来，<br>一直在<span class="serif-accent">连接。</span></h2><p>从 AI 产品，到品牌传播，<br>再到平台与用户。<br>每一站，都让我多一个看问题的角度。</p><div class="journey-stamp">4<span>段实习</span><i>不同视角，同样投入。</i></div></div><div class="timeline">${experiences.map((e, i) => `<details class="experience" ${i === 0 ? 'open' : ''}><summary><span class="timeline-dot"></span><span class="experience-head"><span class="experience-date">${e.date}</span><strong>${e.company}</strong><span class="experience-role">${e.role}</span></span><span class="expand-icon">${icon('plus')}</span></summary><div class="experience-body"><span class="experience-dept">${e.department}</span><p>${e.summary}</p><ul>${e.points.map(p => `<li>${p}</li>`).join('')}</ul><div class="project-tags">${e.tags.map(t => `<span>${t}</span>`).join('')}</div></div></details>`).join('')}</div></div></section>
    <section class="skills section" id="skills"><div class="section-marker"><span>04 / 我的工具箱</span><span>工具会更新，解决问题的能力会留下。</span></div><div class="section-title-row"><h2>不只会用，<br>更知道<span class="serif-accent">为什么用。</span></h2><span class="toolbox-symbol" aria-hidden="true">✳</span></div><div class="skills-layout"><div class="skill-tabs" role="tablist" aria-label="能力方向">${skills.map((s, i) => `<button role="tab" id="tab-${s.id}" aria-controls="skill-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" class="skill-tab ${i === 0 ? 'active' : ''}" data-skill="${s.id}"><span>0${i + 1}</span><strong>${s.title}</strong>${icon('arrow-up-right')}</button>`).join('')}</div><div id="skill-panel" class="skill-panel" role="tabpanel" tabindex="0" aria-labelledby="tab-${skills[0].id}"></div></div></section>
    <section class="contact section" id="contact"><div class="contact-top"><span class="eyebrow"><span class="status-dot"></span> 2027 届 · 期待新的连接</span><span>下一段故事，或许与你有关。</span></div><h2>好想法，<br>值得<span>一起发生</span><b>↗</b></h2><div class="contact-bottom"><p>正在寻找品牌营销、数字营销与产品运营方向的机会。<br>如果你也相信好奇心和行动力，我们可能很合拍。</p><button class="button dark" data-resume>进一步认识我 ${icon('arrow-up-right')}</button></div></section>
  </main>
  <footer class="site-footer"><a class="brand" href="#home">Rin<span class="brand-dot">.</span></a><span>© 2026 党艺灵 · 以好奇心驱动，以行动力回应。</span><a href="#home">回到顶部 ${icon('arrow-up-right')}</a></footer>
  <div class="floating-tools"><button class="icon-button" data-sound aria-label="开启工作室环境音" aria-pressed="false" title="环境音默认关闭">${icon('volume-x')}</button><span>慢慢来，比较快。</span></div>
  <dialog class="detail-dialog" id="detail-dialog" aria-labelledby="dialog-title"><div class="dialog-inner"><button class="dialog-close icon-button" aria-label="关闭弹窗">${icon('x')}</button><div id="dialog-content"></div></div></dialog>
  <div class="toast" role="status" aria-live="polite"></div>
`;
refreshIcons();

let studio;
try {
  studio = createStudio(document.querySelector('#studio'), action => {
    if (action === 'about') wave();
    else document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
  });
} catch (error) {
  const container = document.querySelector('#studio');
  container.innerHTML = `<img class="webgl-fallback" src="${assetBase}/rin-reference.jpg" alt="Rin：黑色长发、红棕色眼镜、米白上衣和灰色百褶裙"/><p class="fallback-note">当前设备未启用 WebGL，已切换插画模式。项目与简历仍可正常浏览。</p>`;
  document.querySelectorAll('[data-reset],[data-night],[data-wave]').forEach(button => { button.disabled = true; });
}

let toastTimer;
function toast(text) {
  const el = document.querySelector('.toast');
  el.textContent = text; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}
let waveTimer;
function wave() {
  studio?.wave();
  const bubble = document.querySelector('.speech-bubble');
  bubble.classList.add('visible');
  clearTimeout(waveTimer); waveTimer = setTimeout(() => bubble.classList.remove('visible'), 2800);
}
document.querySelector('[data-wave]').addEventListener('click', wave);
document.querySelector('[data-reset]').addEventListener('click', () => { studio?.reset(); toast('已经回到初始视角'); });
document.querySelector('[data-night]').addEventListener('click', event => {
  const button = event.currentTarget;
  const night = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(night));
  button.setAttribute('aria-label', night ? '切换白天工作室' : '切换夜间工作室');
  button.innerHTML = icon(night ? 'sun' : 'moon');
  document.querySelector('.scene-wrap').classList.toggle('night', night);
  studio?.setNight(night); refreshIcons();
});
document.querySelectorAll('[data-scene-action]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.sceneAction === 'about') { wave(); setTimeout(() => document.querySelector('#about').scrollIntoView({ behavior: 'smooth' }), 900); }
  else document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
}));

const dialog = document.querySelector('#detail-dialog');
const dialogContent = document.querySelector('#dialog-content');
function openDialog(html) {
  dialogContent.innerHTML = html;
  refreshIcons();
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
}
function closeDialog() {
  document.body.classList.remove('dialog-open');
  dialog.close();
}
dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); });
dialog.addEventListener('click', e => {
  const rect = dialog.getBoundingClientRect();
  if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) closeDialog();
});
function showProject(id) {
  const p = projects.find(project => project.id === id);
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  openDialog(`<div class="dialog-project-header art-${p.id}"><span class="eyebrow">${p.company} · ${p.category} · ${p.year}</span><h2 id="dialog-title">${p.title}</h2><p>${p.subtitle}</p><div class="dialog-metric"><strong>${p.metric}</strong><span>${p.metricLabel}</span></div></div><div class="dialog-project-body"><div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div><div class="case-steps">${p.steps.map((s, i) => `<section><span>0${i + 1}</span><div><h3>${s.title}</h3><p>${s.text}</p></div></section>`).join('')}</div>${p.note ? `<p class="case-note">数据说明 · ${p.note}</p>` : ''}<button class="next-project" data-next="${next.id}"><span>下一个实践<b>${next.title}</b></span>${icon('arrow-right')}</button></div>`);
  dialogContent.querySelector('[data-next]').addEventListener('click', e => showProject(e.currentTarget.dataset.next));
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => showProject(button.dataset.project)));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  document.querySelectorAll('[data-project-card]').forEach(card => { card.hidden = button.dataset.filter !== '全部' && card.dataset.category !== button.dataset.filter; });
}));

function showSkill(id, focus = false) {
  const skill = skills.find(s => s.id === id);
  document.querySelectorAll('[data-skill]').forEach(button => {
    const selected = button.dataset.skill === id;
    button.classList.toggle('active', selected); button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus();
  });
  const panel = document.querySelector('#skill-panel');
  panel.setAttribute('aria-labelledby', `tab-${id}`);
  panel.innerHTML = `<span class="skill-panel-label">把能力放进真实场景</span><h3>${skill.title}</h3><p>${skill.description}</p><div class="skill-tools">${skill.tools.map(t => `<span>${t}</span>`).join('')}</div><div class="skill-proof">${icon('sparkles')}<span>${skill.proof}</span></div>`;
  refreshIcons();
}
showSkill(skills[0].id);
document.querySelectorAll('[data-skill]').forEach(button => button.addEventListener('click', () => showSkill(button.dataset.skill)));
document.querySelector('.skill-tabs').addEventListener('keydown', event => {
  const current = skills.findIndex(s => document.activeElement.dataset.skill === s.id);
  if (current === -1) return;
  let next;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (current + 1) % skills.length;
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (current + skills.length - 1) % skills.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = skills.length - 1;
  if (next !== undefined) { event.preventDefault(); showSkill(skills[next].id, true); }
});

function resumeText() {
  return `党艺灵 Rin\n2027届硕士｜品牌营销 · 数字营销 · 产品运营\n\n${profile.bio}\n\n教育经历\n${profile.education.join('\n')}\n\n实习经历\n${experiences.map(e => `${e.company}｜${e.role}｜${e.date}\n${e.points.map(p => `· ${p}`).join('\n')}`).join('\n\n')}\n\n精选项目\n${projects.map(p => `${p.title}｜${p.company}\n${p.steps.map(s => `${s.title}：${s.text}`).join('\n')}${p.note ? `\n数据说明：${p.note}` : ''}`).join('\n\n')}\n\n技能\n${skills.map(s => `${s.title}：${s.tools.join('、')}`).join('\n')}\n\n成果\n${profile.awards.join('\n')}\n\n整理日期：2026年9月15日\n联系方式未公开，可通过收到作品集时的原沟通渠道联系。`;
}
function showResume() {
  openDialog(`<div class="resume-content"><span class="eyebrow">用一页，认识 Rin</span><h2 id="dialog-title">党艺灵<span>Rin.</span></h2><p class="resume-subtitle">2027 届硕士 / 品牌营销 · 产品运营 · AI 应用</p><p>${profile.bio}</p><div class="resume-education">${profile.education.map(e => `<div>${icon('graduation-cap')}<span>${e}</span></div>`).join('')}</div><h3>四段经历，同一份好奇心。</h3><div class="resume-experiences">${experiences.map(e => `<div><strong>${e.company}</strong><span>${e.role}</span><small>${e.date}</small></div>`).join('')}</div><div class="resume-awards">${profile.awards.map(a => `<span>${a}</span>`).join('')}</div><div class="resume-actions"><button class="button primary" data-download>${icon('download')} 下载中文履历</button><button class="button outline" data-copy>${icon('copy')} 复制个人简介</button></div><p class="contact-note">联系方式暂不公开，可通过你收到这份作品集时的原沟通渠道联系我。下载内容为中文文本版履历。</p></div>`);
  dialogContent.querySelector('[data-download]').addEventListener('click', () => {
    const blob = new Blob(['\uFEFF' + resumeText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = '党艺灵_Rin_中文履历.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); toast('中文履历已准备下载');
  });
  dialogContent.querySelector('[data-copy]').addEventListener('click', async event => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(`你好，我是党艺灵 Rin，暨南大学新闻与传播专业2027届硕士。拥有腾讯、影石、阳狮集团及亚信科技实习经历，专注品牌营销、产品运营与AI应用，期待与你交流。`);
      button.innerHTML = `${icon('check')} 已复制`; refreshIcons(); toast('个人简介已复制');
    } catch { toast('浏览器未允许复制，可下载中文履历'); }
  });
}
document.querySelectorAll('[data-resume]').forEach(button => button.addEventListener('click', showResume));
document.querySelector('[data-avatar]').addEventListener('click', () => openDialog(`<div class="avatar-dialog"><div><span class="eyebrow">我的数字分身</span><h2 id="dialog-title">从平面，<br>走进小小世界。</h2><p>保留插画里的黑色长发、红棕色眼镜、米白上衣与灰色百褶裙，将它们变成工作室里可以从不同角度观察的立体形象。</p><p>回到工作室，拖动鼠标旋转视角，点一下小手，和另一个我打个招呼。</p><span class="avatar-model-note">${studio?.getState().modelReady ? '图生三维模型 · 已保存到本地网站资源' : '正在使用轻量立体形象'}</span></div><img src="${assetBase}/rin-reference.jpg" alt="专属三维形象所依据的原始二维插画"/></div>`));

const menuButton = document.querySelector('.mobile-menu');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '关闭导航' : '打开导航');
  document.querySelector('.desktop-nav').classList.toggle('is-open', isOpen);
  menuButton.innerHTML = icon(isOpen ? 'x' : 'menu'); refreshIcons();
});
document.querySelectorAll('.desktop-nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.desktop-nav').classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '打开导航'); menuButton.innerHTML = icon('menu'); refreshIcons();
}));
const sections = document.querySelectorAll('main > section[id]');
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) document.querySelectorAll('.desktop-nav a').forEach(a => a.classList.toggle('current', a.hash === `#${entry.target.id}`));
}, { rootMargin: '-25% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

let audioContext, audioGain, audioOn = false;
const soundButton = document.querySelector('[data-sound]');
soundButton.addEventListener('click', async () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioGain = audioContext.createGain(); audioGain.gain.value = 0; audioGain.connect(audioContext.destination);
      [130.81, 164.81, 196, 261.63].forEach((frequency, i) => {
        const osc = audioContext.createOscillator(), gain = audioContext.createGain();
        osc.type = 'sine'; osc.frequency.value = frequency;
        gain.gain.value = 0.16 / (i + 1); osc.connect(gain); gain.connect(audioGain); osc.start();
      });
    }
    await audioContext.resume(); audioOn = !audioOn;
    audioGain.gain.setTargetAtTime(audioOn ? 0.13 : 0, audioContext.currentTime, 0.5);
    soundButton.setAttribute('aria-pressed', String(audioOn)); soundButton.setAttribute('aria-label', audioOn ? '关闭工作室环境音' : '开启工作室环境音');
    soundButton.innerHTML = icon(audioOn ? 'volume-2' : 'volume-x'); refreshIcons(); toast(audioOn ? '轻柔环境音已开启' : '环境音已关闭');
  } catch { toast('当前浏览器无法播放环境音'); }
});
document.addEventListener('visibilitychange', () => {
  if (!audioContext) return;
  if (document.hidden) audioContext.suspend();
  else if (audioOn) audioContext.resume();
});
window.__rinStudio = studio;
