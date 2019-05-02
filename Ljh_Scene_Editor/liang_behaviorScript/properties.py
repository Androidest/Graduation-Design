#===================== import =======================
import bpy

from bpy.props import (IntProperty,
                       BoolProperty,
                       StringProperty,
                       CollectionProperty,
                       PointerProperty)

from bpy.types import PropertyGroup

#===================== property classes =======================
class LIANG_scene_behaviorScript_item(PropertyGroup):
    name: StringProperty()
    id: IntProperty()

class LIANG_object_behaviorScript_item(PropertyGroup):
    linkId: IntProperty()
    id: IntProperty()

#===================== register ==========================
behaviorScript_properties_classes = (
    LIANG_scene_behaviorScript_item,
    LIANG_object_behaviorScript_item,
)

def behaviorScript_properties_register():
    from bpy.utils import register_class
    for cls in behaviorScript_properties_classes:
        register_class(cls)

    bpy.types.Scene.behaviorScripts = CollectionProperty(type=LIANG_scene_behaviorScript_item)
    bpy.types.Scene.scriptIndex = IntProperty()

    bpy.types.Object.behaviorScripts = CollectionProperty(type=LIANG_object_behaviorScript_item)
    bpy.types.Object.scriptIndex = IntProperty()

def behaviorScript_properties_unregister():
    from bpy.utils import unregister_class
    for cls in reversed(behaviorScript_properties_classes):
        unregister_class(cls)

    del bpy.types.Object.behaviorScripts
    del bpy.types.Object.scriptIndex

    del bpy.types.Scene.behaviorScripts
    del bpy.types.Scene.scriptIndex