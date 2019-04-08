bl_info = {
    "name": "BI Stephen's Addon v1.0.0",
    "category": "3D View",
    "author": "Alan Stephen"
}

import bpy, os, re, bpy, fnmatch
try:
    import simplejson as json
except (ImportError,):
    import json

#-------------------------Sequence Exporter----------------------------------------------------------------------------------------------------
class StephenSequenceExporter(bpy.types.Operator):
    bl_idname = "view3d.stephen_sequence_exporter"
    bl_label = "Stephen's Sequence Exporter"

    def execute(self, context):
        #=========================read from file==================================
        file = open(os.path.abspath(bpy.data.filepath+ "/../../../Assets/GameScenes/Levels.js"), "r+")
        data = file.read()
        data = data.replace("var levels =", '{"levels":')
        data = data.replace("var sequence =", '"sequence":')
        data = data.replace(";", ",")
        data = re.sub(re.compile("//.*?\n" ) ,"" ,data)
        data += "}"
        data = json.loads(data)
        levels = data["levels"]
        sequence = data["sequence"]
        file.close()

        #==========================edit data=====================================
        scene = context.scene
        for i in range(0,scene.Index-len(sequence)+1):
            sequence.append([])

        dat = sequence[scene.Index]
        if(len(dat) != 4):
            dat.extend([0,0,0,0])
        
        dat[0] = scene.IntervalSpace
        dat[1] = scene.Theme
        dat[2] = scene.Difficulty
        dat[3] = int(scene.Type)

        try:
            if(len(levels[scene.Theme][scene.Difficulty][dat[3]][0]) == 0):
                self.report({'ERROR_OUT_OF_MEMORY'}, 'Saving Sequence Failed: No such Template, please create it first!')
                return {'FINISHED'}
        except:
            self.report({'ERROR_OUT_OF_MEMORY'}, 'Saving Sequence Failed: No such Template, please create it first!')
            return {'FINISHED'}

        #========================export to file================================
        typeName = ["Reward", "Obstacle", "Mix"]
        code = 'var levels = \n[\n'

        th = 0
        for theme in levels:
            di = 0
            code += "    //Theme "+str(th)+" *******************************************************************************************************\n    [\n"
            for diff in theme:
                ty = 0
                code += "        //=======Difficulty "+str(di)+" =======================================\n        [\n"
                for type in diff:
                    code += "            //-------"+typeName[ty]+"-------------------\n            [\n                //____templates______"
                    for template in type:
                        code += ",\n                " + str(template)
                    ty += 1
                    code += "\n            ],\n" if ty<len(diff) else "\n            ]\n"
                di += 1 
                code += "        ],\n\n" if di<len(theme) else "        ]\n\n"
            th += 1 
            code += "    ],\n\n" if th<len(levels) else "    ]\n\n"
        code += '];\n\nvar sequence = \n[    '

        i = 0
        for seq in sequence:
            if i%10 == 0 :
                code += "\n    "
            i+=1
            code += str(seq) + (", " if i<len(sequence) else "")
        code += "\n]"

        file = open(os.path.abspath(bpy.data.filepath+ "/../../../Assets/GameScenes/Levels.js"), "w")
        file.write(code)
        file.close()
        return {'FINISHED'}

#-------------------------Level Exporter----------------------------------------------------------------------------------------------------
class StephenLevelExporter(bpy.types.Operator):
    bl_idname = "view3d.stephen_level_exporter"
    bl_label = "Stephen's Level Exporter"

    def execute(self, context):
        #=========================read from file==================================
        file = open(os.path.abspath(bpy.data.filepath+ "/../../../Assets/GameScenes/Levels.js"), "r+")
        data = file.read()
        data = data.replace("var levels =", '{"levels":')
        data = data.replace("var sequence =", '"sequence":')
        data = data.replace(";", ",")
        data = re.sub(re.compile("//.*?\n" ) ,"" ,data)
        data += "}"
        data = json.loads(data)
        levels = data["levels"]
        sequence = data["sequence"]
        file.close()

        #==========================edit data=====================================
        scene = context.scene
        theme = scene.Theme
        diff = scene.Difficulty
        type = int(scene.Type)
        temp = scene.Template
        isRotation = scene.Rotation
        floatNumb = 2

        scene = bpy.context.scene
        objects = [obj for obj in scene.objects if fnmatch.fnmatchcase(obj.name, "Obj_*")]
        newTemplate = []
        for obj in objects:
            if obj.location.y > 0:
                id = int(obj.name.replace("Obj_", "")[0])
                objData = [id,round(obj.location.x, floatNumb),round(obj.location.z, floatNumb),round(obj.location.y, floatNumb)]
                if isRotation:
                    objData.extend([round(obj.rotation_euler.x, floatNumb),round(obj.rotation_euler.z, floatNumb),round(obj.rotation_euler.y, floatNumb)])
                newTemplate.append(objData)
        #-----sort array by z------
        newTemplate.sort(key=lambda obj:obj[3])

        for i in range(0,theme-len(levels)+1):
            levels.append([])

        for i in range(0,diff-len(levels[theme])+1):
            levels[theme].append([[],[],[]])

        for i in range(0,temp-len(levels[theme][diff][type])+1):
            levels[theme][diff][type].append([])
        levels[theme][diff][type][temp] = newTemplate


        #========================export to file================================
        typeName = ["Reward", "Obstacle", "Mix"]
        code = 'var levels = \n[\n'

        th = 0
        for theme in levels:
            di = 0
            code += "    //Theme "+str(th)+" *******************************************************************************************************\n    [\n"
            for diff in theme:
                ty = 0
                code += "        //=======Difficulty "+str(di)+" =======================================\n        [\n"
                for type in diff:
                    code += "            //-------"+typeName[ty]+"-------------------\n            [\n                //____templates______"
                    for template in type:
                        code += ",\n                " + str(template)
                    ty += 1
                    code += "\n            ],\n" if ty<len(diff) else "\n            ]\n"
                di += 1 
                code += "        ],\n\n" if di<len(theme) else "        ]\n\n"
            th += 1 
            code += "    ],\n\n" if th<len(levels) else "    ]\n\n"
        code += '];\n\nvar sequence = \n[    '

        i = 0
        for seq in sequence:
            if i%10 == 0 :
                code += "\n    "
            i+=1
            code += str(seq) + (", " if i<len(sequence) else "")
        code += "\n]"

        file = open(os.path.abspath(bpy.data.filepath+ "/../../../Assets/GameScenes/Levels.js"), "w")
        file.write(code)
        file.close()
        print('Stephen: template exported to file!')
        return {'FINISHED'}



#-------------------------Previewer----------------------------------------------------------------------------------------------------
class StephenSequencePreview(bpy.types.Operator):
    bl_idname = "view3d.stephen_sequence_preview"
    bl_label = "Stephen's Sequence Preview"

    def execute(self, context):
        #=========================read from file==================================
        file = open(os.path.abspath(bpy.data.filepath+ "/../../../Assets/GameScenes/Levels.js"), "r+")
        data = file.read()
        data = data.replace("var levels =", '{"levels":')
        data = data.replace("var sequence =", '"sequence":')
        data = data.replace(";", ",")
        data = re.sub(re.compile("//.*?\n" ) ,"" ,data)
        data += "}"
        data = json.loads(data)
        levels = data["levels"]
        sequence = data["sequence"]
        file.close()

        #===delete clones and create object cache=====================================
        scene = context.scene
        dat = sequence[scene.Index]
        theme = dat[1]
        diff = dat[2]
        type = dat[3]
        temp = 0

        scene.Theme = theme
        scene.Difficulty = diff
        scene.Type = str(type)
        scene.Template = temp

        objects = []
        scene = bpy.context.scene

        for obj in scene.objects:
            if fnmatch.fnmatchcase(obj.name, "Obj_*"):
                if obj.location.y <= 0:
                    id = int(obj.name.replace("Obj_", "")[0])
                    for i in range(0, id-len(objects)+1):
                        objects.append(0)
                    objects[id] = obj
                else:
                    bpy.data.objects.remove(obj, True) #delete clones

        #======clone from data to preview================================
        templateData = levels[theme][diff][type][temp]
        scene.Rotation = len(templateData[0]) > 4
        for t in templateData:
            c = objects[t[0]].copy()
            c.location.x = t[1]
            c.location.y = t[3]
            c.location.z = t[2]
            if scene.Rotation:
                c.rotation_euler.x = t[4]
                c.rotation_euler.y = t[6]
                c.rotation_euler.z = t[5]
            scene.objects.link(c)
        return {'FINISHED'}


#-------------------------Previewer----------------------------------------------------------------------------------------------------
class StephenLevelPreview(bpy.types.Operator):
    bl_idname = "view3d.stephen_level_preview"
    bl_label = "Stephen's Level Preview"

    def execute(self, context):
        #=========================read from file==================================
        file = open(os.path.abspath(bpy.data.filepath+ "/../../../Assets/GameScenes/Levels.js"), "r+")
        data = file.read()
        data = data.replace("var levels =", '{"levels":')
        data = data.replace("var sequence =", '"sequence":')
        data = data.replace(";", ",")
        data = re.sub(re.compile("//.*?\n" ) ,"" ,data)
        data += "}"
        data = json.loads(data)
        levels = data["levels"]
        file.close()

        #===delete clones and create object cache=====================================
        scene = context.scene
        theme = scene.Theme
        diff = scene.Difficulty
        type = int(scene.Type)
        temp = scene.Template

        objects = []
        scene = bpy.context.scene

        for obj in scene.objects:
            if fnmatch.fnmatchcase(obj.name, "Obj_*"):
                if obj.location.y <= 0:
                    id = int(obj.name.replace("Obj_", "")[0])
                    for i in range(0, id-len(objects)+1):
                        objects.append(0)
                    objects[id] = obj
                else:
                    bpy.data.objects.remove(obj, True) #delete clones

        #======clone from data to preview================================
        templateData = levels[theme][diff][type][temp]
        scene.Rotation = len(templateData[0]) > 4
        for t in templateData:
            c = objects[t[0]].copy()
            c.location.x = t[1]
            c.location.y = t[3]
            c.location.z = t[2]
            if scene.Rotation:
                c.rotation_euler.x = t[4]
                c.rotation_euler.y = t[6]
                c.rotation_euler.z = t[5]
            scene.objects.link(c)
        return {'FINISHED'}


#-------------------------Panel----------------------------------------------------------------------------------------------------
class StephenPanel(bpy.types.Panel):
    bl_label = "BI Stephen Menu"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'TOOLS'
    bl_category = "Tools"
    bl_context = (("objectmode"))

    def updateLevel(self, context):
        bpy.ops.view3d.stephen_level_preview()
    
    def updateSequence(self, context):
        bpy.ops.view3d.stephen_sequence_preview()
    
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
        box.operator("view3d.stephen_level_exporter", text="Save Level", icon="LIBRARY_DATA_DIRECT")
        box.separator()

        layout.separator()

        box = layout.box()
        box.label(text='Sequence:')
        box.prop(scene, 'Index')
        box.prop(scene, 'IntervalSpace')
        box.separator()
        box.operator("view3d.stephen_sequence_exporter", text="Save Sequence", icon="LIBRARY_DATA_DIRECT")
        box.separator()

        layout.separator()
        layout.separator()
        layout.label(text='-- By Stephen --', icon="BLENDER")

def register():
    bpy.utils.register_class(StephenSequenceExporter)
    bpy.utils.register_class(StephenSequencePreview)
    bpy.utils.register_class(StephenLevelExporter)
    bpy.utils.register_class(StephenLevelPreview)
    bpy.utils.register_class(StephenPanel)

def unregister():
    bpy.utils.unregister_class(StephenSequenceExporter)
    bpy.utils.unregister_class(StephenSequencePreview)
    bpy.utils.unregister_class(StephenLevelExporter)
    bpy.utils.unregister_class(StephenLevelPreview)
    bpy.utils.unregister_class(StephenPanel)

if __name__ == "__main__":
    register()
