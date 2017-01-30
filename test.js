var _ = require('lodash');
var fs = require('fs');
var apps = require('./test.json');

var purchaseRequestV1 = _.find(apps, {
	app: 'SupplierProductManager'
});

var finalApps = [];
var graph = buildGraph(purchaseRequestV1);
finalApps = _.uniq(finalApps, function(a) {
	return a.app;
});

function mapString(dep, visited) {
	visited = _.assign({}, visited);
	var app = _.find(apps, {
		app: dep
	});

	if (visited[dep]) {
		return dep;
	} else {
		visited[dep] = true;
		return buildGraph(app, visited);
	}
}

function buildGraph(app, visited) {
	finalApps.push(app);
	return {
		name: app.app,
		children: app.dependencies.map(function(a) {
			return mapString(a, visited);
		})
	};
}

fs.writeFileSync('cool.json', JSON.stringify(finalApps, null, '    '));
