bl_info = {
    "name" : "Ljh_Scene_Editor",
    "author" : "Stephen Leong",
    'version': (6, 0, -10),
    "description" : "",
    "blender" : (2, 80, 0),
    "warning" : "",
    "category" : "Object"
}

import bpy, os, subprocess
from bpy.types import ( Header, Menu, Panel, Operator )
from .liang_exporter import exporter_register, exporter_unregister
from .liang_behaviorScript import behaviorScript_register, behaviorScript_unregister
httpServer = subprocess.Popen("", shell=True)

class MyOp(Operator):
    bl_idname = "view3d.testop"
    bl_label = "testOp"

    def execute(self, context): 
        global httpServer
        os.chdir(bpy.path.abspath('//')+"..//..//")
        subprocess.Popen("TASKKILL /F /PID {pid} /T".format(pid=httpServer.pid))
        httpServer = subprocess.Popen(".\\liang.bat -http", shell=True)
        return {'FINISHED'}

class LIANG_PT_StephenPanel(Panel):
    bl_label = "Ljh Scene Editor"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = "Scene Editor"

    def draw(self, context):
        layout = self.layout
        layout.label(text = "Hello World")
        layout.operator("export.liang_exporter", text="Export" ) 
        layout.operator("view3d.testop", text="MyOp" ) 
        layout.operator_menu_enum("object.select_object", "select_objects", text = "Select object")

classes = (
    # Operator sub-classes
    MyOp,

    # Panel sub-classes
    LIANG_PT_StephenPanel,
)

def register():
    from bpy.utils import register_class
    for cls in classes:
        register_class(cls)

    behaviorScript_register()
    exporter_register()

def unregister():
    exporter_unregister()
    behaviorScript_unregister()
    
    from bpy.utils import unregister_class
    for cls in reversed(classes):
        unregister_class(cls)