import bpy
from bpy.types import Operator

class LIANG_OT_add_script(Operator):
    bl_idname = "liang.add_script"
    bl_label = "Add Script"
    bl_description = "Add a Behavior Script to the object"
    bl_options = {'REGISTER'}

    scope: bpy.props.EnumProperty( items=(
                ('SCENE', "Scene", ""),
                ('OBJECT', "Object", "")
    ))

    def invoke(self, context, event):
        if self.scope == 'SCENE':
            scene = context.scene
            behaviorScripts = scene.behaviorScripts

            newScript = behaviorScripts.add()
            newScript.name = "NewBehaviorScript"
            newScript.id = len(behaviorScripts)-1 
            scene.scriptIndex = newScript.id
            info = newScript.name + " added to the list"
            self.report({'INFO'}, info)

        elif self.scope == 'OBJECT':
            object = context.object
            behaviorScripts = object.behaviorScripts

            if object:
                newScript = behaviorScripts.add()
                newScript.linkId = -1
                newScript.id = len(behaviorScripts)-1
                object.scriptIndex = newScript.id
                info = newScript.name + " added to the list"
                self.report({'INFO'}, info)
        else:
            self.report({'INFO'}, "Nothing selected in the Viewport")
        return {"FINISHED"}