class TableSheetElement extends HTMLElement{
constructor(){
  super();
  this._thead=this._tbody=this._model=null;
  this._cols=[];
  this._rows=[];
  this.attachShadow({mode:'open'}).innerHTML=`<style>
td.left{
  text-align:left;
}
td.right{
  text-align:right;
}
td.center{
  text-align:center;
}
td,th{
  border:1px solid rgba(127,127,127,.5);
}
table,table th,table td{
  box-sizing:border-box;
  position:relative;
  border-collapse:collapse;
  font:normal 1em monospace;
  padding:.5em 1em;
}
tbody>tr:first-child{
  visibility:collapse;
}
td:not([tabindex]){
  background:#f8f8f8;
}
th,td:first-child{
  background:#ddd;
  cursor:default;
  user-select:none;
}
th:first-child{
  border:none;
  background:transparent;
}
td{
  background:#fff;
}
td:focus{
  outline:none;
}
td[data-placeholder]:empty:before{
  content:attr(data-placeholder);
  opacity.5;
}
td:focus:before{
  content:'';
  position:absolute;
  box-sizing:border-box;
  top:-1px;right:-1px;bottom:-1px;left:-1px;
  border:2px solid rgba(100,170,255,.75);
}
</style><table><thead></thead><tbody></tbody></table>`;
}
connectedCallback(){
  this._thead=this.shadowRoot.querySelector('thead');
  const tbody=this._tbody=this.shadowRoot.querySelector('tbody');
  this._update();
  tbody.addEventListener("focusin",e=>{
    const target=e.target;
    target.contentEditable=true;
    target.data=target.innerText;
    target.addEventListener('keydown',this._edit,false);
  },false);
  tbody.addEventListener("focusout",e=>{
    const target=e.target;
    const format=this._cols[[...target.parentElement.children].indexOf(target)-1].format;
    if(format)target.innerText=`${format(target.textContent)||target.data}`;
    target.removeAttribute('data');
    target.contentEditable=false;
    target.removeEventListener('keydown',this._edit);
  },false);
}
set model(model){
  if(model&&(model.data||model.rows)&&(model.columns||model.cols)){
    this._cols=model.columns||model.cols;
    this._rows=model.data||model.rows;
  }else{
    this._rows=[];
    this._cols=[];
  }
  this._update();
}
_update(){
  const thead=this._thead;
  const tbody=this._tbody;
  thead.innerHTML='';
  tbody.innerHTML='';
  const cols=this._cols;
  const rows=this._rows;
  const trh=document.createElement('tr');
  thead.appendChild(trh);
  const th=document.createElement('th');
  trh.appendChild(th);
  cols.forEach(c=>{
    const th=document.createElement('th');
    th.innerText=c.name;
    trh.appendChild(th);
  });
  const trb=document.createElement('tr');
  tbody.appendChild(trb);
  const td=document.createElement('td');
  trb.appendChild(td);
  cols.forEach(c=>{
    const td=document.createElement('td');
    td.innerText=c.placeholder||'';
    trb.appendChild(td);
  });
  rows.forEach((r,i)=>{
    const tr=document.createElement('tr');
    tbody.appendChild(tr);
    const td=document.createElement('td');
    td.classList.add('right');
    td.innerText=`${i+1}`;
    tr.appendChild(td);
    cols.forEach(c=>{
      const td=document.createElement('td');
      if(c.editable) td.tabIndex=0;
      if(c.placeholder) td.setAttribute('data-placeholder',c.placeholder);
      if(c.align)td.classList.add(c.align);
      const format=c.format;
      td.innerText=`${(format?format(`${r[c.key||c.name]}`):null)||r[c.key||c.name]||''}`;
      tr.appendChild(td);
    })
  });
}
_edit=(e)=>{
  if(e.key==="Enter"){
    const next=it=>{
      let n=it;
      while(true){
        if(!n) return null;
        if(n.tabIndex===0) return n;
        n=n.nextElementSibling;
      }
    };
    const nextCol=next(e.target.nextElementSibling);
    if(nextCol) return nextCol.focus();
    let row=e.target.parentElement.nextElementSibling;
    while(true){
      if(!row) return;
      const n=next(row.firstElementChild);
      if(n) return n.focus();
      row=row.nextElementSibling;
    }
  }
};
}
customElements.define('table-sheet',TableSheetElement);
const currentLocaleDecimalSeparator=()=>(new Intl.NumberFormat()).formatToParts(1.1).find(p=>p.type==='decimal').value;

const formats={
  float: (n=2,decimalSeparator)=>{
    const dec=currentLocaleDecimalSeparator();
    return it=>{
      const v=parseFloat(it.replace(/[,]/g,'.'));
      if(isNaN(v)) return null;
      const s=`${Math.round(v*Math.pow(10,n))}`;
      const len=s.length;
      return `${s.substring(0,len-n).padStart(1,'0')}${dec}${s.substring(len-n).padEnd(n,'0')}`;
    }
  },
  integer: ()=>{
    return it=>{
      console.log('it',`"${it}"`);
      const v=parseFloat(it.replace(/[,]/g,'.'));
      if(isNaN(v)) return null;
      return `${Math.round(v)}`;
    }
  },
  date: ()=>{
    return it=>{
      const t=Date.parse(it);
      if(isNaN(t)) return null;
      const d=new Date(t);
      const yyyy=`${d.getFullYear()}`;
      const MM=`${d.getMonth()+1}`.padStart(2,'0');
      const dd=`${d.getDate()}`.padStart(2,'0');
      return `${yyyy}-${MM}-${dd}`;
    }
  },
  uppercase: ()=>{
    return it=>it.toUpperCase();
  },
  lowercase: ()=>{
    return it=>it.toLowerCase();
  },
  capitalize: ()=>{
    return it=>it?`${it.charAt(0).toUpperCase()}${it.substring(1)}`:'';
  }
};
export { formats, TableSheetElement as default }
