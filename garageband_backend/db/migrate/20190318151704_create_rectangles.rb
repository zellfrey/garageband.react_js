class CreateRectangles < ActiveRecord::Migration[5.2]
  def change
    create_table :rectangles do |t|
      t.integer :posX
      t.integer :posY
      t.integer :width
      t.integer :height
      t.integer :project_id
      t.integer :note_id
    end
  end
end
