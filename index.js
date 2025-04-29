"useStrict"

const $bar = document.querySelectorAll('.bar');
const $bars = document.querySelector('.bars');
const $barsValue = document.querySelector('.barsValue');
const $tbody = document.querySelector('tbody');
const $edit = document.querySelector('.edit');
const $addBtn = document.querySelector('.addBtn');
const $valueInput = document.querySelector('.valueInput');
const $xLine = document.querySelector('.xLine');
const $json = document.querySelector('.json')
const $jsonBtn = document.querySelector('.jsonBtn')


// 기본값
let data = [75,20,80,100,70];

function render(){

    $bars.innerHTML='';
    $barsValue.innerHTML='';
    $tbody.innerHTML='';

    // 막대 너비 + 갭까지 고려한 전체 길이
    const barWidth = 20;
    const gap = 50;
    const totalWidth = barWidth * data.length + gap * (data.length - 1);

    $bars.style.width = totalWidth + 'px';
    $barsValue.style.width = totalWidth + 'px';
    $xLine.style.width = totalWidth + 40 + 'px';

    data.forEach((datas,index)=>{
        const newBar = document.createElement('div');
        const newBarValue = document.createElement('div');
        newBar.classList.add('bar');
        newBarValue.classList.add('barValue');
        newBar.style.height = (datas) + '%';
        newBar.textContent = datas
        newBarValue.textContent = index;
        $bars.append(newBar);
        $barsValue.append(newBarValue);
        
        const newTr = document.createElement('tr');
        const newTd1 = document.createElement('td');
        newTd1.textContent = index;
        const newTd2 = document.createElement('td');
        newTd2.textContent = datas;
        const newTd3 = document.createElement('td');
        const tableBtn = document.createElement('button');
        tableBtn.textContent="삭제"
        newTd3.append(tableBtn);
        
        newTr.append(newTd1,newTd2,newTd3)
        
        if(index % 2 === 0){
            newTr.style.backgroundColor = '#c0c0c0'
        }else{
            newTr.style.backgroundColor = '#d3d3d3'
        }
        $tbody.append(newTr)

        
        tableBtn.addEventListener('click',e=>{
            if($edit.textContent ==="Apply"){

                const idx = +e.target.parentElement.parentElement.children[0].textContent;
                e.target.parentElement.parentElement.remove();
                $bars.children[idx].remove();
                $barsValue.children[idx].remove();
                
                // data 배열에서도 삭제한 idx 삭제
                data.splice(idx,1);
                
                $barsValue.querySelectorAll('.barValue').forEach((barValue,idx)=>{
                    barValue.textContent = idx;
                })
                
                $tbody.querySelectorAll('tr').forEach((tr,idx) => {
                    tr.children[0].textContent=idx;
            })
        }
        })
       
        
        
    });
}

$edit.addEventListener('click',e=>{
    if(e.target.textContent === "Edit"){
        e.target.textContent = "Apply"

        // 삭제 버튼 켬
        $tbody.querySelectorAll("button").forEach(btn => { btn.disabled = false
            btn.style.color="red";
        });
        
        // 값 부분 input으로 바꿔서 수정가능
        $tbody.querySelectorAll('tr').forEach(tr=>{
                const valueId = tr.children[1]; 
                const input = document.createElement('input');
                input.value = valueId.textContent;
                valueId.innerHTML='';
                    valueId.append(input);
        })
        
    }else {
        
        e.target.textContent = "Edit"
        
        // 삭제 버튼 끄기
        $tbody.querySelectorAll("button").forEach(btn => btn.disabled = true);

        // 값 부분 읽어서 data에 새로저장
        $tbody.querySelectorAll('tr').forEach((tr,idx)=>{
            const input = tr.children[1].querySelector('input');
            if(input){
                data[idx] = +input.value;
            }
        })
        render();
    }
})

function doubleInput() {
    const addValue = Number($valueInput.value);
    if(!isNaN(addValue) && addValue !==0 && addValue < 101){
        data.push(addValue);
        render();
        renderJson();
        $valueInput.value ='';
        $valueInput.focus();
    }else{
        alert('100이하 숫자만 입력 바랍니다.')
        $valueInput.value ='';
        $valueInput.focus();
    }
}
// add 클릭이나 엔터 둘다 입력받기위해
$addBtn.addEventListener('click',doubleInput)
$valueInput.addEventListener('keydown',e=>{
    if(e.key === 'Enter'){
        doubleInput();
    }
})

function renderJson() {
    const jsonValue = data.map((value,index)=>({
        id:index,
        value:value,
    }))
    $json.innerHTML = `<pre>${JSON.stringify(jsonValue,null,3)}</pre>`;
}

let jsonEditGo = false;
let jsonText ='';


$jsonBtn.addEventListener('click',e=>{
    if(!jsonEditGo){
        jsonEditGo = true;
        e.target.textContent = "Apply";

      jsonText = $json.innerText;
      $json.innerHTML = `<textarea style="width:100%;height:300px;">${jsonText}</textarea>`
        
    }else {
        jsonEditGo=false;
        e.target.textContent = "Edit"
        
        const textarea = $json.querySelector('textarea');
        try{
            const reValue = JSON.parse(textarea.value);
            
            data = reValue.map(a => a.value);
            
            render();
            renderJson();
        }catch{
            alert('오류')
        }
    }
})



renderJson();

render();








