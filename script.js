// global
var xmlhttp = new XMLHttpRequest();
var urlJSON = "disciplinas.json";
var listaDisciplinas = [];
var disciplina, infoBox;
var boxList = [null];
var lastClicked = "";
const colors = {"": "#000", "comp": "#34a25c", "si": "#4ba7b1", "mat": "#d67070", "adm": "#d68016", "outros": "#c0a6c5", "none": "#000"};

// requisicao json
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        listaDisciplinas = JSON.parse(this.responseText);
    }
}
xmlhttp.open("GET", urlJSON, true);
xmlhttp.send();

// listar infoboxes
window.addEventListener("load", function() {
	var allBoxes = document.getElementsByClassName("infobox");
	for(let i = 0; i < allBoxes.length; i++) {
		boxList.push(new InfoBox(allBoxes[i]));
	}
});

function TicTac3(n){
for(var i=1;i<=n;i++){
console.log((i%3==0&&i%5==0)?"TIC TAC":(i%3==0)?"TIC":(i%5==0)?"TAC":i);}}

// Classe infobox
function InfoBox(element) {
	var self = this;
	self.element = element;
	self.visible = false;
	self.changeBoxHeight = function(tam) {
		self.element.style.height = tam + "px";
	};
	// Abrir infobox
	self.open = function(disciplina) {
		// fechar infoboxes abertas
		for(let i = 1; i < boxList.length; i++) {
			if(boxList[i].visible) { 
				boxList[i].close();
			}
		}
		// abrir infobox solicitada
		setTimeout(function(){ 
			self.visible = true;
			lastClicked = disciplina.id;
			self.displayInfo(disciplina);
			var contentHeight = document.getElementById("content" + disciplina.box).clientHeight;
			self.changeBoxHeight(contentHeight + 60); }, 500);
	};
	// Fechar infobox
	self.close = function() {
		self.visible = false;
		self.changeBoxHeight(0);
	};
	// Mostrar conteudo na infobox
	self.displayInfo = function(disciplina) {
		var content = "<div class='content' id='content"+ disciplina.box + "'>";
		// periodo
		if(disciplina.periodo > 0) { content += "<span class='text-periodo'>" + disciplina.periodo + "º Período</span>"; }
		else { content += "<span class='text-periodo'>Sem periodização</span>"; }
		// nome
		content += "<h2>"+disciplina.nome+"</h2><span class='text-id'>"+disciplina.id.toUpperCase()+"</span>" + tagBox() + "<ol class='details'><li class='details-li'><h3>Ementa:</h3>" + disciplina.ementa + "</li>";
	    // pre-requisitos
	    if(disciplina.pre.length > 0) content += "<li class='details-li'><h3>Pré-requisitos:</h3>" + requisitosBox(disciplina.pre) + "</li>";
	    // co-requisitos
	    if(disciplina.co.length > 0) content += "<li class='details-li'><h3>Co-requisitos:</h3>" + requisitosBox(disciplina.co) + "</li>";
	    // site
	    if(disciplina.site) content += "<li class='details-li'><h3>Site: </h3><a href='"+disciplina.site+"' target='_blank'>"+"Clique para visitar o site da disciplina"+"</a></li>";
	    self.element.innerHTML = content + "</ol></div>";
	};
}

// principal
function showInfoBox(id) {
	disciplina = getDisciplina(id);
	infoBox = boxList[disciplina.box]; // box1, box2...
	if (!infoBox.visible) infoBox.open(disciplina);
	else {
		infoBox.close();
		if(lastClicked !== disciplina.id) infoBox.open(disciplina);
	}
}
// manipular objeto da disciplina
function getDisciplina(id) {
	for(let i = 0; i < listaDisciplinas.length; i++) {
		if(id == listaDisciplinas[i].id) { return listaDisciplinas[i]; }
	}
	return { "id": "None", "nome": "None", "class": "none", "tipo": "None", "periodo": 1, 
	"ch": 0, "creditos": 0, "ementa": "None", "pre": [], "co": [], "site": "", box: 1 }
}
// lista de co e pre requisitos
function requisitosBox(list) {
	if(list.length == 0) return "Nenhum";
	var content = "";
	for(let i = 0; i < list.length; i++) {
		let dis = getDisciplina(list[i]);
		content += "<div class='req' style='background-color:" + colors[dis.class] + ";' title='"+ 
		dis.nome +"'>" + dis.id.toUpperCase() + "</div>";
	}
	return content;
}
// tag para tipo, ch e creditos
function tagBox() {
	var backColor = colors[disciplina.class];
	return "<div class='tagbox'><div class='tag' style='background-color:" + backColor + ";'>" + disciplina.tipo.toUpperCase() + "</div>" +
	"<div class='tag' style='background-color:" + backColor + ";'>" + String(disciplina.ch).toUpperCase() + " HORAS</div>" +
	"<div class='tag' style='background-color:" + backColor + ";'>" + String(disciplina.creditos).toUpperCase() + " CRÉDITOS</div></div>";
}