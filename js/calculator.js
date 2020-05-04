class Module {
    constructor() {
        this.name = "";
        this.CATS = 0;
        this.weightings = [];
        this.marks = [];
        this.percentageDone = 0;
        this.catsDone = 0;
        
        this.scaledPercentageDone = 0;
        this.scaledCATS = 0;
        this.scaledWeightings = [];
    }
    add_assessment(weight, mark) {
        this.weightings.push(weight);
        this.marks.push(mark);
    }

    percentage_done() {
        let total = 0;
        for (var i = 0; i < this.weightings.length; i++) {
            total += this.weightings[i] * this.marks[i];
        }
        this.percentageDone = total / 100;
   
    }

    CATS_done() {
        let temp = 0
        for (var i = 0; i < this.weightings.length; i++) {
            temp += parseFloat(this.weightings[i]);
        }
        this.catsDone = (temp * this.CATS) / 100;
    }

    scale_data(scaleFactor) {
        this.scaledWeightings = [];
        var scaler = this.CATS / scaleFactor;

        for (var i = 0; i < this.weightings.length; i++) {
            this.scaledWeightings.push(this.weightings[i] * scaler);
        }
        this.scaledPercentageDone = this.percentageDone * scaler;
        this.scaledCATS = this.CATS * scaler;
    }
}


var modules = [];


var firstYear = {
    "mark": 0,
    "weighting": 0
};
var secondYear = {
    "mark": 0,
    "weighting": 0,
    "percentageDone": 0
};
var thirdYear = {
    "mark": 0,
    "weighting": 0,
    "percentageDone": 0
};
var thirdYearActual = {
    "mark": 0,
    "weighting": 0
};

function calculateGB() {
    firstYear["mark"] = document.getElementById("mark-first-year").value;
    firstYear["weighting"] = document.getElementById("weight-first-year").value / 100;

    secondYear["mark"] = document.getElementById("mark-second-year").value;
    secondYear["weighting"] = document.getElementById("weight-second-year").value / 100;

    var scaleFactor = 99999999999999;
    for (var i = 0; i < modules.length; i++) {
        if (scaleFactor > modules[i].CATS) {
            scaleFactor = modules[i].CATS;
        }
    }
    
    for (var i = 0; i < modules.length; i++) {
        modules[i].scale_data(scaleFactor);
    }

    var percent_of_third_year_completed = 0;
    var total_cats = 0;
    for (var i = 0; i < modules.length; i++) {
        percent_of_third_year_completed += parseFloat(modules[i].catsDone);
  
        total_cats += parseInt(modules[i].CATS,10);
    }
    if (total_cats < 120) {
        total_cats = 120;
    }
    
    percent_of_third_year_completed /= total_cats;
    
    var a = modules.reduce((prev, cur) => prev + cur.scaledPercentageDone, 0);

    var b = modules.reduce((prev, cur) => prev + cur.scaledWeightings.reduce((a, b) => a + b, 0), 0);

    var current_third_year = (a / b) * 100;

    thirdYear.mark = current_third_year;
    thirdYear.weighting = document.getElementById('weight-third-year').value / 100;
    thirdYear.percentageDone = percent_of_third_year_completed;

    thirdYearActual.weighting = document.getElementById('weight-third-year').value / 100;
    thirdYearActual.mark = document.getElementById('mark-third-year').value;

    graduationBenchmark = (firstYear.mark * firstYear.weighting + secondYear.mark * secondYear.weighting +
        (thirdYear.mark * thirdYear.weighting * thirdYear.percentageDone)) /
        (firstYear.weighting + secondYear.weighting + (thirdYear.weighting * thirdYear.percentageDone));

    actualGrade =  (firstYear.mark*firstYear.weighting + secondYear.mark*secondYear.weighting +
        thirdYearActual.mark*thirdYearActual.weighting) / 
        (firstYear.weighting + secondYear.weighting + thirdYear.weighting);
    if (isNaN(graduationBenchmark)) {
        graduationBenchmark = 0;
    }
    if (isNaN(actualGrade)) {
        actualGrade = 0;
    }
    if (isNaN(current_third_year)) {
        current_third_year = 0;
    }
    if (actualGrade > graduationBenchmark) {
        $("#actual").css("color","#00d1b2");
        $("#gb").css("color","");
    }
    else if (graduationBenchmark > actualGrade) {
        $('#gb').css("color","#00d1b2");
        $("#actual").css("color","");
    }
    else {
        $("#actual").css("color","");
        $("#gb").css("color","");
    }
    
    document.getElementById('gb').innerHTML = "Graduation Benchmark: " + graduationBenchmark.toFixed(2)+"%";
    document.getElementById('actual').innerHTML = "Forecasted Grade: " + actualGrade.toFixed(2) + "%";
    document.getElementById('y3avg').innerHTML = "Year 3 Average: " + current_third_year.toFixed(2) + "%";

}




var moduleCount = 1;
var moduleAssignments = { "1": 1 };
function add_assignment(id) {
    num =  parseInt(id.replace ( /[^\d.]/g, '' ), 10);

    moduleAssignments[num] += 1;
    // document.getElementById("suckass-" + num).innerHTML +=
    $('#suckass-'+num).append(
        `<hr>
        <div class="control">
        Weighting: <input id="weight-`+ num + `-` + moduleAssignments[num] + `" class="input" type="number" placeholder="e.g. 30"> <br><br>
        Mark: <input id="mark-`+ num + `-` + moduleAssignments[num] + `" class="input" type="number" placeholder="e.g. 70">
        </div>`);
}

function create_module(id) {
    m = new Module();
    num =  parseInt(id.replace ( /[^\d.]/g, '' ), 10);


    m.name = document.getElementById('name-' + num).value;
    if (!!document.getElementById('cats-' + num).value) {
        m.CATS = document.getElementById('cats-' + num).value;
    }
    else {
        m.CATS = 0;
    }
    var assessTotal = 0;
    for (var i = 1; i <= moduleAssignments[num]; i++) {
        var w = document.getElementById('weight-' + num + '-' + i).value;
        var mark = document.getElementById('mark-' + num + '-' + i).value;
        if (!!w && !!mark) {
            m.add_assessment(w, mark);
        }
    }
    m.percentage_done();
    m.CATS_done();
    if (m.CATS > 0) {
        modules.push(m);
      
    var modules_size = modules.length ;
    console.log(modules_size);
    document.getElementById('module-' + num).innerHTML =`
        <article class = "media">
        <div class = "media-content">
        <b>Module</b>:  `+ m.name +`
        <br><b>CATS</b>: ` + m.CATS +`
        <br><b>Achieved</b>: ` + m.percentageDone + `% <br>
        </div>
        <div class = "media-right">
        <button id='`+(modules.length-1)+`'class='button is-danger is-pushed-right' onclick='delete_module(this.id)'>X</button>";
        </div>
        </article>
    `
    }
    else {
        // alert("test");
        console.log($('#cats-'+num));
        $('#cats-'+num).addClass("is-danger");
    }
}


function delete_module(id) {
    var id_int = parseInt(id);
    for (var i = id_int; i < modules.length; i++)
        if (i == modules.length-1) {
            modules.pop();
        }
        else {
            modules[i] = modules[i+1];
        }
    var element = document.getElementById(id);
    var element2 = element.parentNode;
    element2.parentNode.parentNode.parentNode.removeChild(element2.parentNode.parentNode);
    
}
function add_module() {
    moduleCount += 1;
    moduleAssignments[moduleCount] = 1;
    $('#modules').append(
    // document.getElementById("modules").innerHTML +=
        `<div class="box" id="module-` + moduleCount + `">
    <div class="field">
        <label class="label">Module</label>
        <div class="control">
            Name (optional):
            <input class="input" id='name-`+ moduleCount + `' type="text" placeholder="e.g. CS324 Graphics">
        </div>
        <div class="control">
            CATS:
            <input class="input" id='cats-`+ moduleCount + `' type="number" placeholder="e.g. 15">
        </div>
    </div>

    <div class="field" id='suckass-`+ moduleCount + `'>
        <label class="label">Assignment</label>
        <div class="control">
            Weighting: 
            <input id="weight-`+ moduleCount + `-` + moduleAssignments[moduleCount] + `" class="input" type="number" placeholder="e.g. 30">
             <br><br>
            Mark: 
            <input id="mark-`+ moduleCount + `-` + moduleAssignments[moduleCount] + `" class="input" type="number" placeholder="e.g. 70">
        </div>

    </div>
    <div class="control">
        <button id="a`+ moduleCount + `" onclick="add_assignment(this.id)" class="button is-link">Add assigment</button>
    </div>
    <br>
    <br>
    <div class="control">
        <button id="m`+ moduleCount + `" onclick="create_module(this.id)" class="button is-link">Confirm Module<</button>
    </div>
</div>`);
}