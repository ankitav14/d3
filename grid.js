/**
 * dashboardFloorplan - data for Grid plugin
 * used in Dashboard 2 view
 */

function dashboardFloorplan($scope, $http){
$scope.selected_marker = "";

var jsonData = {};

var xscale = d3.scale.linear()
               .domain([0,50.0])
               .range([0,587]),
    yscale = d3.scale.linear()
               .domain([0,33.79])
               .range([0,300]),
    map = d3.floorplan().xScale(xscale).yScale(yscale),
    imagelayer = d3.floorplan.imagelayer(),
    mapdata = {};

// load image 
	mapdata[imagelayer.id()] = [{
    url: 'http://img11.deviantart.net/db36/i/2011/096/b/7/flynn__s_sector_grid_by_kurokikazexing-d3dc3n2.png',
    x: 0,
    y: 0,
    height: 33.79,
    width: 50.0
     }];

map.addLayer(imagelayer);
$('.map-controls').hide();
/* var projection = function(d){
		console.log("index : " + JSON.stringify(d));		

}; */

var removeRect = function(id){
         //d3.selectAll('g #'+id).remove();
	//console.log("index : " + JSON.stringify(id));		
   };  

var loadData = function(data) {
	//console.log("Data sdfsdh : " + data.length);
	d3.select("#floorplan").append("svg")
		.attr("id","floor")
		.attr("height", 450)
		.attr("width",700)
		.datum(mapdata).call(map)
		
var tempdata1 = $scope.mapDatafiltered;
var tempdata = [];
var cnt=0;
for(var i=0; i<tempdata1.length; i++){
	if(tempdata1[i].CX!=null && tempdata1[i].CY!=null){
		tempdata[cnt]=tempdata1[i];
		cnt++;
	}	
}
	var sampleSVG = d3.select("#floor")
		.append("svg:svg")
		.attr("class", "sample")
		.attr("width", 700)
		.attr("height", 450)
		//.attr("transform", function(d) {
			//		return "translate(" + projection([d.width, d.height]) + ")";})
		//.attr('transform', 'translate(0,200) scale('+scale+','+scale+')')
		//.attr("transform", "translate(50, 0)");

//Plotting Shapes(rectangles) on the Grid		
	for(var i=0; i< tempdata.length; i++)
	{
		var name = "rect"+i;
		  d3.select("#floor svg").selectAll('rect')
			.data(tempdata).enter()
			.append("svg:rect")
			.attr("stroke", "black")
			.attr("fill", (d,i)=>tempdata[i].SENSOR_COLOR)
			.attr("width", 15)
			.attr("height", 15)
			.attr("x", (d,i)=>tempdata[i].CX)
			.attr("y", (d,i)=>tempdata[i].CY)
			.attr("id",(d,i)=>name)
		
            .on("click", function(d,index){
            //console.log("d" + JSON.stringify(d));
            removeRect(name);	
			$scope.selected_marker = tempdata[index];
			$('#myModal').modal('show');
			//console.log(tempdata[index]);
        })  
		
//Display image on mousehover

		    .on('mouseenter', function(d) {
            // select element in current context
           // console.log("d = ",JSON.stringify(d));
             //console.log(tempdata[i]);
          d3.select( this )
            .transition()
		    .attr("height", 100)
		    .attr("width", 100)
		    .style("fill", function(d){
				//console.log("id", d.SENSOR_ID);
			  var returnImage;
              if (d.SENSOR_ID === 148037277745336) 
					{
							//alert("hi");
						returnImage = "url(#image_oven)";
                    }  
					else
					{ 
						returnImage = "url(#image)";
                    } 
                return returnImage;
			});
			
			
	     d3.select(this).append("svg:title")
			.text(function(d) { 
				return d.SENSOR_NAME;  
			}) 
			
          })
  
		  
			.on( 'mouseleave', function(d) {
				//console.log("d = ",JSON.stringify(d));
          d3.select( this )
            .transition()
            .attr("height", 15)
            .attr("width", 15)
			.style("fill", (d,i)=>d.SENSOR_COLOR)
          })
	
	
	}
$('.map-controls').remove();	
};

//Display data on the modal   
$scope.selected_marker = "";
$('#myModal').on('show.bs.modal', function (e) {
					var summarydata = $scope.selected_marker;
			  //console.log("summarydata : " + summarydata);
					$(".modal-body #sensorid").html(summarydata.SENSOR_ID);
					$(".modal-body #sensorname").html(summarydata.SENSOR_NAME);
					$(".modal-body #sessiontype").html(summarydata.SESSION_TYPE);
			});

/*$scope.$watch("mapDatafiltered",function(){
jsonData = $scope.mapDatafiltered;
loadData(jsonData);
//$('#floor').remove();
console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&watch called");
});
*/

//Get data from sensor_map table
$http.get('/nodejs/sensor_map').success(function(data) {
    if (data) {
      $scope.mapData = data;
      $scope.mapDatafiltered = data;
	  jsonData = $scope.mapDatafiltered;
	  loadData(jsonData);
    }
  }).error(function(err) {
    //console.log("err", err);
  })

}
function navigation_modal1($scope, $location, $modal) {
	$scope.getpage = function(nav){
		//console.log("navigation : " + nav);
		$('#myModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$location.path(nav);
	}
}
angular.module('inspinia').controller('dashboardFloorplan', dashboardFloorplan)
		                  .controller('navigation_modal1', navigation_modal1);
