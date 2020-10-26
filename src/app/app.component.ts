import { Component, OnInit } from '@angular/core';
import * as babylon from 'babylonjs';
import { Scene, Engine } from 'babylonjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Angular 6';
  y: number = 1;
  lightX: number = 0;
  red: number = 0.7;
  canvas: any;
  engine: any;
  world: any;

  sphere: babylon.Mesh;
  skybox: any;

  ngOnInit() {
    this.canvas = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
    var createScene = function () {
      var scene = new BABYLON.Scene(this.engine);
      var camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
      //camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(this.canvas, false);
      camera.wheelDeltaPercentage = 0.02;
      camera.pinchDeltaPercentage = 0.001;
      camera.lowerAlphaLimit = 5;
      var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(this.lightX, 1, 0), scene);
      var light2 = new BABYLON.DirectionalLight('light2', new BABYLON.Vector3(1, -1, 0), scene);
      light.intensity = 0.4;
//       this.skybox = BABYLON.Mesh.CreateBox('skyBox', 100, scene, true);
//       var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
// skyboxMaterial.backFaceCulling = false;
// skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://www.tonytextures.com/free-texture-gallery/sky/Sky_Clouds_Photo_Texture_A_P4192452", scene);
// skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
// skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
// skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
// this.skybox.material = skyboxMaterial;

      this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 1, scene, false, BABYLON.Mesh.FRONTSIDE);
      var f =  BABYLON.Mesh.CreateSphere('sphere1', 16, 1, scene, false, BABYLON.Mesh.FRONTSIDE);
      // f.updatePoseMatrix()
      f.position = new BABYLON.Vector3(1,1,1);
      BABYLON.MeshBuilder.CreateCylinder('cylinder', { height: 1, diameterBottom: 0.5 }, scene);
      var myMaterial = new BABYLON.StandardMaterial("blue", scene);
      myMaterial.diffuseColor = new BABYLON.Color3(.5, 0, 1);
      myMaterial.specularColor = new BABYLON.Color3(this.red, 0.6, 0.87);
      this.sphere.material = myMaterial;
      this.sphere.position.y = this.y;
      var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
      var myMaterial = new BABYLON.StandardMaterial("green", scene);
      myMaterial.diffuseColor = new BABYLON.Color3(0, .8, 0);
      myMaterial.specularColor = new BABYLON.Color3(0.7, 0.6, 0.87);
      ground.material = myMaterial;
      // Return the created scene
      return scene;
    }.bind(this);

    var scene = createScene();
    this.world = scene;
    // run the render loop
    this.engine.runRenderLoop(function () {
      scene.render();
    });
    window.addEventListener('resize', function () {
      scene.resize();
    });
  }

  moveSphere($event) {
    var ball = this.world.getMeshByID('sphere1');
    var new_position = new BABYLON.Vector3(ball.position.x, $event.value, ball.position.z);
    debugger;
    ball.position = new_position;

  }

  moveLight($event) {
    var light = this.world.getLightByID('light1');
    light.setDirectionToTarget(new BABYLON.Vector3($event.value, 1, light.getAbsolutePosition().z));
  }

  handleFileSelect($event) {
    debugger;
    var files = $event.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function (e) {
          console.log(e.target.result);
          var image = e.target.result;
          var texture = new BABYLON.Texture('data:my_image_name', this.world, true,
            true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, image, true);
          debugger;
          let ball = this.world.getMeshByID('sphere1');
          ball.material.diffuseTexture = texture;
        };
      })(f).bind(this);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }
}