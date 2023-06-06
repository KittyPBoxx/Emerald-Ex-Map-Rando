var template = `
<html>
<head>
<style>
.row {
    border: 1px solid red;
} 
</style>
</head>
<body>
<p> SPOLIER LOG WIP </p>
{{#each this}}
    <div class="row">
        <div class="col-md-12">
            <h2>LOCATION: {{name}}</h2>
            <div>
                <p>REQUIRED FLAGS:</p>
                {{#each flags}} 
                    {{this}} 
                {{/each}}
            </div>
            <ul class="people_list">
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
    let spoilers = allshortestPaths();
    let compiledTemplate = Handlebars.compile(template);
    let newTab = window.open('about:blank', '_blank');
    newTab.document.write(compiledTemplate(spoilers));
    newTab .document.close();
}