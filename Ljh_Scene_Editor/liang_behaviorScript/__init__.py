from .properties import (behaviorScript_properties_register,
                        behaviorScript_properties_unregister)

from .operators import (behaviorScript_operators_register,
                        behaviorScript_operators_unregister)

from .ui import (behaviorScript_ui_register, 
                behaviorScript_ui_unregister)

def behaviorScript_register():
    behaviorScript_properties_register()
    behaviorScript_operators_register()
    behaviorScript_ui_register()

def behaviorScript_unregister():
    behaviorScript_ui_unregister()
    behaviorScript_operators_unregister()
    behaviorScript_properties_unregister()