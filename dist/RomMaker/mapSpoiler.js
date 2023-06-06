var template = `
<html>
<head>
<style>
.row {
    border: 1px solid #b03e00;
    padding: 1em;
} 

@font-face {
	font-family: 'AvenirLTStd';
	src:url('../ui/fonts/AvenirLTStd-Black.otf');
	font-weight: normal;
	font-style: normal;
}

body { 
    background: #1c1c1c !important;
    color: #bdbdbd !important;
    font-family: 'AvenirLTStd', sans-serif;
}

a {
    color: #bdbdbd !important;
}

html {
    scroll-behavior: smooth;
}

.links {
    display: flex;
    flex-wrap: wrap;
}

.scroll-hint {
    position: absolute;
    bottom: 0;
    right: 1em;
    font-size: 5vw;
    color: #000000;
    opacity: 0.3;
    text-shadow: 2px 2px 3px rgb(141 141 141 / 50%);
    display: block;
}

li a {
    padding-top: 0.4em;
    display: block;
}

.row ul li:nth-child(even) {
    opacity: 0.5;
    list-style: none;
} 

.required-flag {
    color: #f44336;
}

.vl {
    border-left: 1px solid #424242;
    height: auto;
}

.links ul h4 {
    height: 1.5em;
    color: #b03e00;
}

.links ul {
    margin-left: 0;
    padding: 2em;
    width: 8em;
}

.wip-desc {
    font-size: 0.8em;
    color: #70701b;
    display: block;
}

::-webkit-scrollbar {
    width: 20px;
}

::-webkit-scrollbar-track {
  background: #141414;
}

::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555555;
}

.unused-location {
    opacity: 0.3;
}

</style>
</head>
<body>
<div style="min-height:100vh; position: relative;">
    <p> SPOLIER LOG WIP <span class="wip-desc">Routes may be falsely flagged as requiring flags if they were needed in V1. <br> Dungeon floor numbers may be wrong.</span></p>
    <div class="links">
        <ul>
        <h4>GYMS</h4>
            <li><a href="#ROXANNE">ROXANNE</a></li>
            <li><a href="#BRAWLY">BRAWLY</a></li>
            <li><a href="#WATTSON">WATTSON</a></li>
            <li><a href="#FLANNERY">FLANNERY</a></li>
            <li><a href="#NORMAN">NORMAN</a></li>
            <li><a href="#WINONA">WINONA</a></li>
            <li><a href="#TATE_AND_LIZA">TATE AND LIZA</a></li>
            <li><a href="#JUAN">JUAN</a></li>
        </ul>
        <div class="vl"></div>
        <ul>
        <h4>E4</h4>
            <li><a href="#SIDNEY">SIDNEY</a></li>
            <li><a href="#SIDNEY_BACK">SIDNEY BACK</a></li>
            <li><a href="#PHOEBE">PHOEBE</a></li>
            <li><a href="#PHOEBE_BACK">PHOEBE BACK</a></li>
            <li><a href="#GLACIA">GLACIA</a></li>
            <li><a href="#GLACIA_BACK">GLACIA BACK</a></li>
            <li><a href="#DRAKE">DRAKE</a></li>
            <li><a href="#DRAKE_BACK">DRAKE BACK</a></li>
            <li><a href="#WALLACE">WALLACE</a></li>
            <li><a href="#STEVEN">STEVEN</a></li>
        </ul>
        <div class="vl"></div>
        <ul>
        <h4>LEGENDARIES</h4>
            <li><a href="#HOHO">HOHO</a></li>
            <li><a href="#LUGIA">LUGIA</a></li>
            <li><a href="#KYOGRE">KYOGRE</a></li>
            <li><a href="#GRAUDON">GRAUDON</a></li>
            <li><a href="#RAYQUAZA">RAYQUAZA</a></li>
        </ul>
        <div class="vl"></div>
        <ul>
        <h4>HMs</h4>
            <li class="unused-location"><a href="#CUT">CUT</a></li>
            <li><a href="#FLASH">FLASH</a></li>
            <li><a href="#ROCKSMASH">ROCKSMASH</a></li>
            <li><a href="#STRENGTH">STRENGTH</a></li>
            <li><a href="#WATERFALL">WATERFALL</a></li>
            <li class="unused-location"><a href="#DIVE">DIVE</a></li>
        </ul>
        <div class="vl"></div>
        <ul>
        <h4>KEY ITEMS</h4>
            <li class="unused-location"><a href="#BIKE_SHOP">BIKE SHOP</a></li>
            <li><a href="#MAGMA_EMBLEM">MAGMA EMBLEM</a></li>
            <li><a href="#STOREAGE_KEY">STOREAGE KEY</a></li>
        </ul>
        <div class="vl"></div>
        <ul>
        <h4>STORY LOCATIONS</h4>
            <li class="unused-location"><a href="#STONE_OFFICE">STONE OFFICE</a></li>
            <li class="unused-location"><a href="#STEVEN_LETTER">STEVEN LETTER</a></li>
            <li class="unused-location"><a href="#WEATHER_INSTITUTE_F2">WEATHER INSTITUTE F2</a></li>
            <li><a href="#WALLACE_ORIGIN_CAVE">WALLACE ORIGIN CAVE</a></li>
            <li class="unused-location"><a href="#METEOR_FALLS_F1">METEOR FALLS F1</a></li>
        </ul>
        <div class="vl"></div>
        <ul>
        <h4>TOWNS</h4>
            <li><a href="#PETALBURG">PETALBURG</a></li>
            <li><a href="#SLATEPORT">SLATEPORT</a></li>
            <li><a href="#MAUVILLE">MAUVILLE</a></li>
            <li><a href="#RUSTBORO">RUSTBORO</a></li>
            <li><a href="#FORTREE">FORTREE</a></li>
            <li><a href="#LILYCOVE">LILYCOVE</a></li>
            <li><a href="#MOSSDEEP">MOSSDEEP</a></li>
            <li><a href="#SOOTOPOLIS">SOOTOPOLIS</a></li>
            <li><a href="#DEWFORD">DEWFORD</a></li>
            <li><a href="#LAVARIDGE">LAVARIDGE</a></li>
            <li><a href="#FALLARBOR">FALLARBOR</a></li>
            <li><a href="#VERDANTURF">VERDANTURF</a></li>
            <li><a href="#PACIFIDLOG">PACIFIDLOG</a></li>
        </ul>
        <div class="scroll-hint">⮟ SPOILERS ⮟</div>
    </div>
</div>
{{#each this}}
    <div class="row">
        <div class="col-md-12">
            <h2 id="{{name}}">LOCATION: {{name}}</h2>
            <div>
                <p>REQUIRED FLAGS:</p>
                <p class="required-flag">{{flags}}</p> 
            </div>
            <ul>
                {{#each route}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        </div>
    </div>
{{/each}}
</body>
</html>
`;

function generateMapSpoiler() {
    let spoilers = allshortestPaths().map(i => { i.name = i.name.replaceAll(" ", "_"); i.flags = [...i.flags].join(", "); return i });
    let compiledTemplate = Handlebars.compile(template);
    let newTab = window.open('about:blank', '_blank');
    newTab.document.write(compiledTemplate(spoilers));
    newTab .document.close();
}