class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.string :name
      t.integer :author_id
      t.string :image
      t.string :description
      t.integer :width
      t.integer :height
      t.integer :amount_of_notes
      t.integer :tempo
      t.timestamps
    end
  end
end
