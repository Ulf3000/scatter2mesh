# ##### BEGIN GPL LICENSE BLOCK #####
#
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU General Public License
#  as published by the Free Software Foundation; either version 2
#  of the License, or (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software Foundation,
#  Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
#
# ##### END GPL LICENSE BLOCK #####



#Information about Addon

bl_info = {
    "name": "scattertomesh",
    "author": "Alex Mehler",
    "version": (0, 0, 1),
    "blender": (2, 80, 0),
    "location": "3D View > Object > Convert to",
    "description": " Convert Scatter to Single Mesh Object",
    "warning": "working in progress",
    "wiki_url": "",
    "category": "Object",
}


import bpy

from bpy.types import (
    AddonPreferences,
    Operator,
    Panel,
    PropertyGroup,
    
)


#class for our script

class OBJECT_OT_scattertomesh(Operator):   # always start with OBJECT_OT_ when manipulating objects
    
    bl_label = "Mesh from Scatter"
    bl_idname = "object.scattertomesh"
    bl_description = "Convert Scatter to Single Mesh Object"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_options = {'REGISTER', 'UNDO'}
    
    
    def execute(self,context):  # simple self context 
                

        bpy.ops.object.duplicates_make_real()

        bpy.ops.object.make_single_user(object=True, obdata=True, material=False, animation=False)
        
        bpy.context.active_object.select_set(state=True)

        for o in bpy.context.object.children:
             bpy.data.objects.remove(o)

        #bpy.data.objects.remove(bpy.context.object)
        
        bpy.ops.object.join()
        bpy.ops.object.collection_remove()
        bpy.ops.object.collection_unlink()
        
        
        col = bpy.context.object.users_collection[0]
        
        #bpy.ops.object.link_to_collection(col.parent)
        
        #bpy.ops.collection.objects_remove(collection=col.name)
        #bpy.data.collections.remove(col)
        
        #bpy.ops.outliner.select_walk(direction='UP')
        #bpy.ops.outliner.collection_delete(hierarchy=False)

        return{'FINISHED'}  # important , use after your function
   




# add the menues to view3d > object 

def menu_func(self, context):
    self.layout.operator(OBJECT_OT_scattertomesh.bl_idname)
    
def register():
    bpy.utils.register_class(OBJECT_OT_scattertomesh)
    bpy.types.VIEW3D_MT_object.append(menu_func)
    
def unregister():
    bpy.utils.register_class(OBJECT_OT_scattertomesh)
    bpy.types.VIEW3D_MT_object.remove(menu_func)
    
if __name__ == "__main__":
    register();