#===================== import =======================
import bpy

from bpy.types import (Panel,
                       UIList)

#===================== ui classes =======================
class LIANG_UL_object_behaviorScript_slot(UIList):
    def draw_item(self, context, layout, data, item, icon, active_data, active_propname, index):
        if item.linkId != -1:
            split = layout.split(factor=0.1)
            split.label(text=str(index+1)+".")
            slot = context.scene.behaviorScripts[item.linkId]
            split.prop(slot, "name", text="", emboss=False, icon="TEXT")
        else:
            layout.label(text="-- Select or create a Behavior Script --")

class LIANG_UL_scene_behaviorScript_slot(UIList):
    def draw_item(self, context, layout, data, item, icon, active_data, active_propname, index):
        split = layout.split(factor=0.1)
        split.label(text=str(index+1)+".")
        split.prop(item, "name", text="", emboss=False, icon="TEXT")

class LIANG_PT_object_behaviorScript_panel(Panel):
    bl_parent_id = "LIANG_PT_StephenPanel"
    bl_label = "Object's Behavior Scripts"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'

    def draw(self, context):
        layout = self.layout
        scene = bpy.context.scene
        object = bpy.context.object

        row = layout.row()
        row.template_list("LIANG_UL_object_behaviorScript_slot", "", object, "behaviorScripts", object, "scriptIndex")

        col = row.column(align=True)
        col.operator("liang.add_script", icon='ADD', text="").scope = "OBJECT"

class LIANG_PT_scene_behaviorScript_panel(Panel):
    bl_parent_id = "LIANG_PT_object_behaviorScript_panel"
    bl_label = "Scene Behavior Scripts"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'

    def draw(self, context):
        layout = self.layout
        scene = bpy.context.scene

        row = layout.row()
        row.template_list("LIANG_UL_scene_behaviorScript_slot", "", scene, "behaviorScripts", scene, "scriptIndex")

        col = row.column(align=True)
        col.operator("liang.add_script", icon='ADD', text="").scope = "SCENE"

#===================== register ==========================
behaviorScript_ui_classes = (
    LIANG_UL_object_behaviorScript_slot,
    LIANG_UL_scene_behaviorScript_slot,
    LIANG_PT_object_behaviorScript_panel,
    LIANG_PT_scene_behaviorScript_panel,
)

def behaviorScript_ui_register():
    from bpy.utils import register_class
    for cls in behaviorScript_ui_classes:
        register_class(cls)

def behaviorScript_ui_unregister():
    from bpy.utils import unregister_class
    for cls in reversed(behaviorScript_ui_classes):
        unregister_class(cls)