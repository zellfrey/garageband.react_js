# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Note.destroy_all
Project.destroy_all
Rectangle.destroy_all
User.destroy_all
# Like.destroy_all

users = User.create([
    {name: "boby", email: "boby@socialcage.com", profile: "placeholder img"},
    {name: "bill", email: "bill@socialcage.com", profile: "placeholder img"},
    {name: "dave", email: "dave@socialcage.com", profile: "placeholder img"}
])

notes = Note.create([
    {name: 'E5', freq: 659.2551},
    {name: 'D5', freq: 587.3295},
    {name: 'C5', freq: 523.2511},
    {name: 'B4', freq: 493.8833},
    {name: 'A4', freq: 440.0000},
    {name: 'G4', freq: 391.9954},
    {name: 'F4', freq: 349.2282},
    {name: 'E4', freq: 329.6276},
    {name: 'D4', freq: 293.6648},
    {name: 'C4', freq: 261.6256},
    {name: 'B3', freq: 246.9417},
    {name: 'A3', freq: 220.0000},
    {name: 'G3', freq: 195.9977},
    {name: 'F3', freq: 174.6141},
    {name: 'E3', freq: 164.8138},
    {name: 'D3', freq: 146.8324}
])

projects = Project.create([{author_id: 2, name: "test", image: "placeholder img", description: 'but what do we want to do with our lives', width: 1200, height: 400, amount_of_notes: 16, tempo: 120}])

rectangles = Rectangle.create([
    {posX: 100, posY: 100, width: 50, height: 50, project_id: 1, note_id: 2},
    {posX: 200, posY: 100, width: 50, height: 50, project_id: 1, note_id: 2},
    {posX: 300, posY: 100, width: 50, height: 50, project_id: 1, note_id: 2}
])


likes = Like.create([
    {admirer_id: 1, project_id: 1},
    {admirer_id: 3, project_id: 1},
])