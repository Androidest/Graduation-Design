bl_info = {
    "name" : "Ljh_Scene_Editor",
    "author" : "Stephen Leong",
    "description" : "",
    "blender" : (2, 80, 0),
    "location" : "View3D",
    "warning" : "",
    "category" : "Object"
}

import bpy
from bpy.types import (
    Header,
    Menu,
    Panel,
)

class VIEW3D_OT_testOp(bpy.types.Operator):
    bl_idname = "view3d.testop"
    bl_label = "Stephen's Level Exporter"

    def execute(self, context):
        #==========================edit data=====================================
        scene = context.scene
        theme = scene.Theme
        diff = scene.Difficulty
        type = int(scene.Type)
        temp = scene.Template 
        isRotation = scene.Rotation

        print(str(theme) + " " + str(diff) + " " + str(type))
        return {'FINISHED'}


class VIEW3D_PT_StephenPanel(Panel):
    bl_label = "Ljh Scene Editor"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = "Scene Editor"

    def updateLevel(self, context):
        bpy.ops.view3d.testop()
    
    def updateSequence(self, context):
        ...
        #bpy.ops.view3d.stephen_sequence_preview()
    
    bpy.types.Scene.Theme = bpy.props.IntProperty(
        name='Theme:',
        description='Theme Index',
        default = 0, min = 0, max = 99,
        update=updateLevel
    )
    bpy.types.Scene.Difficulty = bpy.props.IntProperty(
        name='Difficulty:',
        description='Difficulty Index',
        default = 0, min = 0, max = 99,
        update=updateLevel
    )
    bpy.types.Scene.Type = bpy.props.EnumProperty(
        items=(
            ('0', "Reward", "Reward Type"),
            ('1', "Obstacle", "Obstacle Type"),
            ('2', "Mix", "Mix Type (with Reward & Obstacle)"),
        ),
        name="ui_tab", 
        description="Type selection control",
        update=updateLevel
    )
    bpy.types.Scene.Template = bpy.props.IntProperty(
        name='Template:',
        description='Template Index',
        default = 0, min = 0, max = 99,
        update=updateLevel
    )
    bpy.types.Scene.Rotation = bpy.props.BoolProperty(
        name='Rotation',
        description="Include rotation property to data",
        default = False,
        )
    bpy.types.Scene.Index = bpy.props.IntProperty(
        name='Index:',
        description='Sequence Index',
        default = 0, min = 0, max = 999999,
        update=updateSequence
    )
    bpy.types.Scene.IntervalSpace = bpy.props.IntProperty(
        name='Interval Space:',
        description='Interval Space',
        default = 0, min = 0, max = 999999,
        update=updateSequence
    )

    def draw(self, context):
        layout = self.layout
        
        scene = context.scene
        box = layout.box()
        box.label(text='Level Template Index:')
        box.prop(scene, 'Theme')
        box.prop(scene, 'Difficulty')
        box.row().prop(scene, 'Type', expand=True)
        box.prop(scene, 'Template')
        box.prop(scene, 'Rotation')
        box.separator()
        box.operator("view3d.testop", text="Save Level", icon="LIBRARY_DATA_DIRECT")
        box.separator()

        layout.separator()

        box = layout.box()
        box.label(text='Sequence:')
        box.prop(scene, 'Index')
        box.prop(scene, 'IntervalSpace')
        box.separator()
        #box.operator("view3d.stephen_sequence_exporter", text="Save Sequence", icon="LIBRARY_DATA_DIRECT")
        box.separator()

        layout.separator()
        layout.separator()
        layout.label(text='-- By Stephen --', icon="BLENDER")

def register():
    bpy.utils.register_class(VIEW3D_OT_testOp)
    bpy.utils.register_class(VIEW3D_PT_StephenPanel)

def unregister():
    bpy.utils.unregister_class(VIEW3D_OT_testOp)
    bpy.utils.unregister_class(VIEW3D_PT_StephenPanel)