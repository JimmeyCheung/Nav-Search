const $dlg = $(".dlg-container");
const $cancelBtn = $(".cancel-btn");
const $siteList = $(".site-list");
const $deleteBtn = $(".delete-btn");
const $finishBtn = $(".finish-btn");
const siteStorage = JSON.parse(localStorage.getItem("siteStorage"));
const siteList = siteStorage || [
    {
        siteName: 'CSDN',
        siteLink: 'https://www.csdn.net/',
        siteLetter: 'D'
    },
    {
        siteName: 'GitHub',
        siteLink: 'https://github.com/',
        siteLetter: 'G'
    },
    {
        siteName: '掘金',
        siteLink: 'https://juejin.im/',
        siteLetter: 'J'
    },
    
];
const dlg = {
    show: (site={siteName:'',siteLink:''})=>{
        const {siteName,siteLink} = site;
        $("#siteName").val(siteName);
        $("#siteLink").val(siteLink);
        $dlg.removeClass("hide-dlg");
    },
    hide: (reload=false)=>{
        if(reload){ 
            loadSiteList();
        }
        $dlg.addClass("hide-dlg");
    },
    selIndex: null,
};
loadEvent();
loadSiteList();

//加载网站列表
function loadSiteList(){
    const htmlList = [];
    siteList.forEach((site,index)=>{
        const html = `
        <a href="${site.siteLink}" target="_blank">
            <li class="site-item">
                <div class="icon">${site.siteLetter}</div>
                <div class="title">${site.siteName}</div>
                <button data-index="${index}" class="list-more" title="修改快捷方式"></button>
            </li>
        </a>`;
        htmlList.push(html);
    });
    htmlList.push(
        `<li class="site-item" id="addSite">
            <div class="icon add-icon"></div>
            <div class="title">添加快捷方式</div>
        </li>`
    );
    $siteList.html(htmlList.join(""));
    $("#addSite").click((e)=>{
        dlg.selIndex = null;
        dlg.show();
    });
    $(".list-more").click((e)=>{
        const {index} = e.target.dataset;
        dlg.selIndex = index;
        dlg.show(siteList[index]);
        e.stopPropagation();
        e.preventDefault();
    });
}
//加载事件
function loadEvent(){
    $cancelBtn.click((e)=>{
        dlg.hide();
    });
    $finishBtn.click((e)=>{
        const siteName = $("#siteName").val();
        const siteLink = $("#siteLink").val();
        if(siteName && siteLink) {
            const site = getSite(siteName,siteLink);
            if(dlg.selIndex<siteList){
                siteList[dlg.selIndex] = site;
            }else{
                siteList.push(site);
            }
            dlg.hide(true);
        }
    });
    $deleteBtn.click(()=>{
        if(dlg.selIndex){
            siteList.splice(dlg.selIndex,1);
        }
        dlg.hide(true);
    });
    window.onbeforeunload = ()=>{
        localStorage.setItem("siteStorage",JSON.stringify(siteList));
    };
}

function getSite(name,url){
    const siteLetter = simplifyUrl(url)[0].toUpperCase();
    return {
        siteName: name,
        siteLink: url,
        siteLetter: siteLetter
    };
}

function simplifyUrl(url){
    return url.replace('https://', '')
      .replace('http://', '')
      .replace('www.', '')
      .replace(/\/.*/, '') // 删除 / 开头的内容
  }