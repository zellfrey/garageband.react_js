class CreateLikes < ActiveRecord::Migration[5.2]
  def change
    create_table :likes do |t|
      t.integer :project_id
      t.integer :admirer_id
      t.timestamps
    end
  end
end
