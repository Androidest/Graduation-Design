import bpy
from .add_script import LIANG_OT_add_script

#===================== register ==========================
behaviorScript_operators_classes = (
    LIANG_OT_add_script,
)

def behaviorScript_operators_register():
    from bpy.utils import register_class
    for cls in behaviorScript_operators_classes:
        register_class(cls)

def behaviorScript_operators_unregister():
    from bpy.utils import unregister_class
    for cls in reversed(behaviorScript_operators_classes):
        unregister_class(cls)